import type { UpdaterCommand } from './presenter.ts';
import { wrapMessageLines, wrapTextLine } from './presenter.ts';

export interface UpdaterMessageWindow extends Window_Base {
  setMessage(title: string, lines: string[], progress?: number): void;
  drawProgress(progress: number, x: number, y: number, width: number): void;
  wrapLine(text: string, width: number): string[];
}

export interface UpdaterConfirmWindow extends Window_HorzCommand {
  _openMzCommands: UpdaterCommand[] | undefined;
  setCommands(commands: UpdaterCommand[]): void;
}

export interface UpdaterWindowConstructors {
  Window_OpenMzMessage: new (rect: Rectangle) => UpdaterMessageWindow;
  Window_OpenMzConfirm: new (rect: Rectangle) => UpdaterConfirmWindow;
}

const PROGRESS_BAR_HEIGHT = 12;

/**
 * Lazily defines updater window subclasses after RMMZ globals are verified,
 * keeping the bundled prototype script inert outside RPG Maker MZ.
 */
export function createUpdaterWindows(): UpdaterWindowConstructors {
  class Window_OpenMzMessage extends Window_Base {
    initialize(rect: Rectangle) {
      super.initialize(rect);
      this.openness = 0;
    }

    setMessage(title: string, lines: string[], progress?: number) {
      const inset = this.itemPadding();
      const width = Math.max(1, this.innerWidth - inset * 2);
      const measure = (value: string) => this.textWidth(value);
      const heading = wrapTextLine(title, width, measure);
      const body = wrapMessageLines(lines, width, measure);
      const hasProgress = typeof progress === 'number';
      const height = this.fittingHeight(
        heading.length + body.length + (hasProgress ? 1 : 0),
      );
      if (this.height !== height) {
        this.height = height;
        this.createContents();
      } else {
        this.contents.clear();
      }

      const lineHeight = this.lineHeight();
      this.changeTextColor(ColorManager.systemColor());
      heading.forEach((line, index) =>
        this.drawText(line, inset, index * lineHeight, width, 'center'),
      );
      this.resetTextColor();
      body.forEach((line, index) =>
        this.drawText(
          line,
          inset,
          (heading.length + index) * lineHeight,
          width,
        ),
      );
      if (hasProgress) {
        this.drawProgress(
          progress,
          inset,
          (heading.length + body.length) * lineHeight,
          width,
        );
      }
    }

    drawProgress(progress: number, x: number, y: number, width: number) {
      const rate = Math.min(Math.max(progress, 0), 1);
      const labelWidth = this.textWidth('100%');
      const barWidth = Math.max(0, width - labelWidth - this.itemPadding());
      const barY =
        y + Math.floor((this.lineHeight() - PROGRESS_BAR_HEIGHT) / 2);

      if (barWidth > 0) {
        this.contents.fillRect(
          x,
          barY,
          barWidth,
          PROGRESS_BAR_HEIGHT,
          ColorManager.gaugeBackColor(),
        );
        const fillWidth = Math.max(0, Math.floor((barWidth - 2) * rate));
        if (fillWidth > 0) {
          this.contents.gradientFillRect(
            x + 1,
            barY + 1,
            fillWidth,
            PROGRESS_BAR_HEIGHT - 2,
            ColorManager.hpGaugeColor1(),
            ColorManager.hpGaugeColor2(),
          );
        }
      }

      this.drawText(
        `${Math.floor(rate * 100)}%`,
        x + width - labelWidth,
        y,
        labelWidth,
        'right',
      );
    }

    wrapLine(text: string, width: number) {
      return wrapTextLine(text, width, (value) => this.textWidth(value));
    }
  }

  class Window_OpenMzConfirm extends Window_HorzCommand {
    declare _openMzCommands: UpdaterCommand[] | undefined;

    initialize(rect: Rectangle) {
      super.initialize(rect);
      this.openness = 0;
      this.deactivate();
    }

    maxCols() {
      return Math.max(1, Math.min(2, this._openMzCommands?.length || 1));
    }

    setCommands(commands: UpdaterCommand[]) {
      this._openMzCommands = commands;
      this.refresh();
      this.select(0);
    }

    makeCommandList() {
      for (const [label, symbol] of this._openMzCommands || []) {
        this.addCommand(label, symbol);
      }
    }
  }

  return { Window_OpenMzMessage, Window_OpenMzConfirm };
}
