const assert = require('assert');
const { bpmToInterval } = require('./app.js');
console.log('🧪 Testing Tempo Master...');
assert(bpmToInterval(60) === 1000, '60 BPM is 1000ms');
assert(bpmToInterval(120) === 500, '120 BPM is 500ms');
console.log('✅ Tempo Master test passed!');
