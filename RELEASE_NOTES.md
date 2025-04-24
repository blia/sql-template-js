# Release Notes

## v1.1.0

### New Features

- **Added support for SQL Views** 🎉
  - The library now automatically recognizes `CREATE VIEW` statements and creates model classes for them
  - Field names are extracted from the SELECT statement in views
  - Views support the same query methods as tables (find, findOne)
  - Added example of using views in documentation and example code

### Documentation Updates

- Added a new section about working with Views in README.md
- Added example SQL file for views
- Updated example code to demonstrate view usage

## v1.0.3

### Bug Fixes

- Fixed typos and improved documentation

## v1.0.2

### Bug Fixes

- Fixed inconsistency in SQL file examples in README

## v1.0.1 

### Improvements

- Initial release with minor improvements

## v1.0.0

### Features

- Initial implementation of SQL template utility
- Support for parameterized queries with type validation
- SQL injection prevention
- JavaScript expressions in SQL templates
- Loading SQL from files
- Model classes from table schemas