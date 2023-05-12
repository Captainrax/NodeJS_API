import { login } from './sqlhelper.js';
import assert from "assert";
import { describe, it } from "mocha";

// to run these tests, type "npx mocha" in a terminal from this dir.

describe('login', function() {
  it('should return employeeID for a valid employee code', function(done) {
    const employeeCode = '1111';
    login(employeeCode, function(employeeID) {
      assert.strictEqual(employeeID, 1);
      done();
    });
  });

  it('should return null for an invalid employee code', function(done) {
    const employeeCode = '11111';
    login(employeeCode, function(employeeID) {
      assert.strictEqual(employeeID, null);
      done();
    });
  });
});
