var test = require('tap-only');
var args = require('../../lib/args');
var sampleArgs = ['node', 'script.js'];

test('load', t => {
  t.isa(args, 'function', 'args is a function');
  t.throws(args, 'process.argv type expected');
  t.ok(args([]), 'works with argv only arg');
  var settings = {};
  var res = args([], settings);
  t.ok(res, 'works with empty settings');
  t.deepEqual(settings, {}, 'settings did not change');
  t.end();
});

test('bool flags', t => {
  var res = args(sampleArgs.concat('--foo', '--bar'));
  t.equal(res.foo, true, 'foo is true');
  t.equal(res.bar, true, 'bar is true');
  t.deepEqual(res._, sampleArgs, 'no additions args left over');
  t.end();
});

test('mixed flags', t => {
  var res = args(sampleArgs.concat('--foo=10', '--bar'));
  t.equal(res.foo, 10, 'foo is 10');
  t.equal(res.bar, true, 'bar is true');
  t.end();
});

test('flag shortcuts', t => {
  var res = args(sampleArgs.concat('-f=10'), { flags: ['foo', 'bar'] });
  t.equal(res.foo, 10, 'foo is 10');
  t.equal(res.bar, false, 'bar default position is false');
  t.end();
});

test('alias have precedence', t => {
  var res = args(sampleArgs.concat('-f=10'), { flags: ['foo'], alias: { f: 'far' } });
  t.equal(res.foo, false, 'foo is false');
  t.equal(res.far, 10, 'alias won the value');
  t.end();
});

test('commands without config', t => {
  var res = args(sampleArgs.concat('run', '-f=10'));
  t.equal(res.command, 'index', 'command defaulted to index');
  t.equal(res.f, 10, 'alias won the value');
  t.end();
});

test('commands with config', t => {
  var res = args(sampleArgs.concat('foo'), { commands: { foo: 'bar' }});
  t.equal(res.command, 'bar', 'command found');
  t.end();
});

test('commands not found and defaults', t => {
  var res = args(sampleArgs.concat('zoo'), { commands: { foo: 'bar', _: 'default' }});
  t.equal(res.command, 'default', 'command found');
  t.end();
});

test.only('command magic defaults work', t => {
  var res = args(sampleArgs.concat('-v'));
  t.equal(res.command, ':::./version', 'version worked');

  var res2 = args(sampleArgs.concat('-h'));
  t.equal(res2.command, ':::./help', 'help worked');
  t.end();
});