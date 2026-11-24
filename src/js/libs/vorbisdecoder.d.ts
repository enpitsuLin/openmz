interface VorbisDecoder {
  destroy: () => void
  send: (arrayBuffer: ArrayBufferLike, loaded: boolean) => void
}

interface VorbisDecoderConstructor {
  new(
    context: AudioContext | null,
    onDecode: (buffer: AudioBuffer) => void,
    onError: (buffer: unknown) => void
  ): VorbisDecoder
}

// eslint-disable-next-line no-var, ts/no-redeclare
declare var VorbisDecoder: VorbisDecoderConstructor
