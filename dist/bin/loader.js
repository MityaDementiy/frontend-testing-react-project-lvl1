#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _index = _interopRequireDefault(require("../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander.default.description('Loads page').arguments('<pageUrl>').option('-o, --output [path]', 'choose output path', process.cwd()).action(async (pageUrl, options) => {
  console.log(await (0, _index.default)(pageUrl, options.output));
}).parse(process.argv);

if (!_commander.default.args.length) _commander.default.help();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vbG9hZGVyLmpzIl0sIm5hbWVzIjpbInByb2dyYW0iLCJkZXNjcmlwdGlvbiIsImFyZ3VtZW50cyIsIm9wdGlvbiIsInByb2Nlc3MiLCJjd2QiLCJhY3Rpb24iLCJwYWdlVXJsIiwib3B0aW9ucyIsImNvbnNvbGUiLCJsb2ciLCJvdXRwdXQiLCJwYXJzZSIsImFyZ3YiLCJhcmdzIiwibGVuZ3RoIiwiaGVscCJdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOztBQUVBOzs7O0FBRUFBLG1CQUNHQyxXQURILENBQ2UsWUFEZixFQUVHQyxTQUZILENBRWEsV0FGYixFQUdHQyxNQUhILENBR1UscUJBSFYsRUFHaUMsb0JBSGpDLEVBR3VEQyxPQUFPLENBQUNDLEdBQVIsRUFIdkQsRUFJR0MsTUFKSCxDQUlVLE9BQU9DLE9BQVAsRUFBZ0JDLE9BQWhCLEtBQTRCO0FBQ2xDQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxNQUFNLG9CQUFPSCxPQUFQLEVBQWdCQyxPQUFPLENBQUNHLE1BQXhCLENBQWxCO0FBQ0QsQ0FOSCxFQU9HQyxLQVBILENBT1NSLE9BQU8sQ0FBQ1MsSUFQakI7O0FBU0EsSUFBSSxDQUFDYixtQkFBUWMsSUFBUixDQUFhQyxNQUFsQixFQUEwQmYsbUJBQVFnQixJQUFSIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgcHJvZ3JhbSBmcm9tICdjb21tYW5kZXInO1xuXG5pbXBvcnQgbG9hZGVyIGZyb20gJy4uL2luZGV4JztcblxucHJvZ3JhbVxuICAuZGVzY3JpcHRpb24oJ0xvYWRzIHBhZ2UnKVxuICAuYXJndW1lbnRzKCc8cGFnZVVybD4nKVxuICAub3B0aW9uKCctbywgLS1vdXRwdXQgW3BhdGhdJywgJ2Nob29zZSBvdXRwdXQgcGF0aCcsIHByb2Nlc3MuY3dkKCkpXG4gIC5hY3Rpb24oYXN5bmMgKHBhZ2VVcmwsIG9wdGlvbnMpID0+IHtcbiAgICBjb25zb2xlLmxvZyhhd2FpdCBsb2FkZXIocGFnZVVybCwgb3B0aW9ucy5vdXRwdXQpKTtcbiAgfSlcbiAgLnBhcnNlKHByb2Nlc3MuYXJndik7XG5cbmlmICghcHJvZ3JhbS5hcmdzLmxlbmd0aCkgcHJvZ3JhbS5oZWxwKCk7XG4iXX0=