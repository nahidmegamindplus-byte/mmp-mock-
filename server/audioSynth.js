// Audio Synthesizer helper for realistic listening audio files
// Generates standard RIFF WAV buffer headers with clean tone and speech-like carrier cues

export function createPcmWav(sampleRate = 22050, durationSeconds = 15, frequency = 440) {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22); // NumChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Generate realistic chimes and subtle modulated exam preamble sound
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Intro chime (0-2s)
    if (t < 1.5) {
      const chimeFreq = t < 0.7 ? 523.25 : 659.25; // C5 to E5
      const decay = Math.exp(-3 * (t % 0.75));
      sample = Math.sin(2 * Math.PI * chimeFreq * t) * decay * 0.4;
    } else {
      // Subtle conversational background carrier cadence for realistic audio playback simulation
      const baseTone = Math.sin(2 * Math.PI * 220 * t);
      const modulation = 0.5 * (1 + Math.sin(2 * Math.PI * 1.5 * t));
      const burst = (Math.sin(2 * Math.PI * 0.4 * t) > 0.1) ? 1 : 0.2;
      sample = (baseTone * modulation * burst * 0.15) + (Math.sin(2 * Math.PI * 330 * t) * 0.05 * burst);
    }

    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return 'data:audio/wav;base64,' + buffer.toString('base64');
}
