class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientPad: OscillatorNode | null = null;
  private ambientPadGain: GainNode | null = null;
  private ambientStopId = 0;
  private loadTickId: ReturnType<typeof setInterval> | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private get output(): GainNode | AudioDestinationNode {
    this.initCtx();
    return this.masterGain ?? this.ctx!.destination;
  }

  private async ensureRunning() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  getIsMuted() {
    return this.isMuted;
  }

  unlockAudio() {
    void this.ensureRunning().then(() => {
      if (!this.isMuted) {
        this.startAmbientHum();
      }
    });
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      void this.ensureRunning().then(() => this.startAmbientHum());
    } else {
      this.stopAmbientHum();
      this.stopLoadingSound();
    }
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.output);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playHover() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.output);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playPageFlip(force = false) {
    if (!force && this.isMuted) return;
    void this.ensureRunning().then(() => this.playPageFlipImpl());
  }

  private playPageFlipImpl() {
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.11;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.12));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(2800, t + 0.035);
    filter.frequency.exponentialRampToValueAtTime(350, t + duration);
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.5, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(180, t);
    thump.frequency.exponentialRampToValueAtTime(90, t + 0.04);
    thumpGain.gain.setValueAtTime(0.24, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.output);

    thump.connect(thumpGain);
    thumpGain.connect(this.output);

    noise.start(t);
    noise.stop(t + duration);
    thump.start(t);
    thump.stop(t + 0.05);
  }

  playTypeKey(force = false) {
    if (!force && this.isMuted) return;
    this.initCtx();
    if (this.ctx?.state === "running") {
      this.playTypeKeyImpl();
      return;
    }
    void this.ensureRunning().then(() => this.playTypeKeyImpl());
  }

  private playTypeKeyImpl() {
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const pitch = 900 + Math.random() * 500;

    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = "square";
    click.frequency.setValueAtTime(pitch, t);
    click.frequency.exponentialRampToValueAtTime(pitch * 0.55, t + 0.022);

    clickGain.gain.setValueAtTime(0.0001, t);
    clickGain.gain.exponentialRampToValueAtTime(0.075, t + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

    const sampleRate = this.ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * 0.014);
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.045, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

    click.connect(clickGain);
    clickGain.connect(this.output);
    noise.connect(noiseGain);
    noiseGain.connect(this.output);

    click.start(t);
    click.stop(t + 0.028);
    noise.start(t);
    noise.stop(t + 0.014);
  }

  startLoadingSound(force = false) {
    if (!force && this.isMuted) return;
    this.stopLoadingSound();
    void this.ensureRunning().then(() => {
      this.playLoadTickImpl();
      this.loadTickId = setInterval(() => this.playLoadTickImpl(), 130);
    });
  }

  stopLoadingSound() {
    if (this.loadTickId) {
      clearInterval(this.loadTickId);
      this.loadTickId = null;
    }
  }

  private playLoadTickImpl() {
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320 + Math.random() * 80, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.04, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.output);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  private startAmbientHum() {
    if (!this.ctx || this.ambientOsc || this.isMuted) return;

    this.ambientStopId++;
    this.ambientOsc = this.ctx.createOscillator();
    this.ambientGain = this.ctx.createGain();

    this.ambientOsc.type = "sine";
    this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 1.5);

    this.ambientOsc.connect(this.ambientGain);
    this.ambientGain.connect(this.output);

    this.ambientOsc.start();

    const pad = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();
    pad.type = "sine";
    pad.frequency.setValueAtTime(110, this.ctx.currentTime);
    padGain.gain.setValueAtTime(0, this.ctx.currentTime);
    padGain.gain.linearRampToValueAtTime(0.035, this.ctx.currentTime + 1.5);
    pad.connect(padGain);
    padGain.connect(this.output);
    pad.start();
    this.ambientPad = pad;
    this.ambientPadGain = padGain;
  }

  private stopAmbientHum() {
    const stopId = ++this.ambientStopId;
    const osc = this.ambientOsc;
    const gain = this.ambientGain;
    const pad = this.ambientPad;
    const padGain = this.ambientPadGain;

    if (!gain || !this.ctx) return;

    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    padGain?.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    setTimeout(() => {
      if (stopId !== this.ambientStopId) return;
      osc?.stop();
      pad?.stop();
      this.ambientOsc = null;
      this.ambientGain = null;
      this.ambientPad = null;
      this.ambientPadGain = null;
    }, 700);
  }
}

export const soundManager = new SoundManager();
