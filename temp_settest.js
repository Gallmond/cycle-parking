
const arr = [
  'foo',
  'foo',
  'foo',
  'bar',
  'bar',
  'fizz',
  'buzz',
]

const s = new Set( arr )

console.log('arr', arr);
console.log('s', s);

s.add('foo')
s.delete('aaaaaaaaaaa')

console.log('s', s);
console.log('s.values()', s.values());
console.log('s.entries()', s.entries());
console.log('Array.from(s)', Array.from(s));


