import * as lamejs from '@breezystack/lamejs';

export const convertWavToMp3 = async (wavBlob) => {
  try {
    // Convert blob to array buffer
    const arrayBuffer = await wavBlob.arrayBuffer();
    
    // Create audio context to decode the audio data properly
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Decode the audio data (this works regardless of header format)
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Get audio data as Float32Array
    const channelData = audioBuffer.getChannelData(0); // Mono audio (first channel)
    
    // Convert Float32Array to Int16Array for MP3 encoding
    const samples = new Int16Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      // Convert float [-1.0, 1.0] to int [-32768, 32767]
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      samples[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    
    // Set up MP3 encoder
    const mp3encoder = new lamejs.Mp3Encoder(
      1, // Mono
      audioBuffer.sampleRate, 
      128 // 128kbps bitrate
    );
    
    const mp3Data = [];
    
    // Process the audio data in chunks
    const chunkSize = 1152; // Must be a multiple of 576 for lamejs
    for (let i = 0; i < samples.length; i += chunkSize) {
      const chunk = samples.subarray(i, Math.min(i + chunkSize, samples.length));
      const mp3buf = mp3encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }
    
    // Get the final part of the MP3
    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
    
    // Combine the MP3 data chunks into a single Blob
    const blob = new Blob(mp3Data, { type: 'audio/mp3' });
    
    // Create a File object from the Blob
    const filename = `recording_${new Date().getTime()}.mp3`;
    const file = new File([blob], filename, { type: 'audio/mp3' });
    
    return file;
  } catch (error) {
    console.error('Error converting to MP3:', error);
    throw error;
  }
};