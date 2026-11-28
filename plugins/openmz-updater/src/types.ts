import type { Buffer } from 'node:buffer';
import type { Stats } from 'node:fs';
import type { ArchiveEntry, ReleaseManifest, RuntimeMetadata } from '@openmz-internal/release-spec';

export interface NodeModules {
  fs: typeof import('node:fs');
  path: typeof import('node:path');
  url: typeof import('node:url');
  buffer: typeof import('node:buffer');
  http: typeof import('node:http');
  https: typeof import('node:https');
  crypto: typeof import('node:crypto');
  zlib: typeof import('node:zlib');
}

export type NodeRequire = <K extends keyof NodeModules>(name: K) => NodeModules[K];

export type DownloadCallback = (loaded: number, total: number) => void;

export interface FetchOptions {
  onData?: DownloadCallback;
  maxBytes?: number;
  maxRedirects?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface FetchResult {
  buffer: Buffer;
  finalUrl: string;
  redirectChain: string[];
}

export interface ProjectOptions {
  projectRoot: string;
  nodeRequire: NodeRequire;
}

export type ParsedManifest = Omit<ReleaseManifest, 'schemaVersion' | 'publishedAt'>;

export interface UpdateCheck {
  installed: RuntimeMetadata | null;
  manifest: ParsedManifest;
  available: boolean;
}

export interface DownloadProgress {
  phase: 'download';
  file: string;
  loaded: number;
  total: number;
}

export type UpdateProgress = DownloadProgress | { phase: 'verify' } | { phase: 'apply'; total: number };

export interface InstallOptions extends ProjectOptions {
  update: UpdateCheck;
  onProgress?: (event: UpdateProgress) => unknown;
  onDownload?: (event: DownloadProgress) => void;
  signal?: AbortSignal;
}

export interface InstallResult extends RuntimeMetadata {
  updatedFiles: string[];
  backupRelativeDir: string;
  requiresRestart: true;
}

export interface PlannedUpgradeFile extends ArchiveEntry {
  targetPath: string;
  stat?: Stats;
}

export interface UpgradePlan {
  root: string;
  files: PlannedUpgradeFile[];
}

export type UpdaterErrorCode =
  | 'ABORTED'
  | 'HTTP_ERROR'
  | 'INCOMPLETE_DOWNLOAD'
  | 'NETWORK_TIMEOUT'
  | 'TOO_MANY_REDIRECTS'
  | 'UNSAFE_PROTOCOL'
  | 'UNSAFE_REDIRECT'
  | 'RESPONSE_TOO_LARGE'
  | 'INVALID_MANIFEST'
  | 'ARCHIVE_SIZE_MISMATCH'
  | 'ARCHIVE_CHECKSUM_MISMATCH'
  | 'INVALID_ARCHIVE'
  | 'UNSAFE_ARCHIVE_PATH'
  | 'PROTECTED_PATH'
  | 'DUPLICATE_ARCHIVE_PATH'
  | 'MISSING_RUNTIME_FILE'
  | 'METADATA_MISMATCH'
  | 'INVALID_INSTALLED_METADATA'
  | 'UNSAFE_TARGET_PATH'
  | 'ROLLBACK_INCOMPLETE';

export interface UpdaterError extends Error {
  readonly code: UpdaterErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;
}
