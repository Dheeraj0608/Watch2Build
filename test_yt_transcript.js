const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('S_oN3vlzpMw');
    const text = transcript.map(t => t.text).join(' ');
    console.log('Success! Length:', text.length);
    console.log(text.slice(0, 100));
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

test();
