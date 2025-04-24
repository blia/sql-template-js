# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-04-24

### Added

- Support for SQL Views with `CREATE VIEW` statements
- Automatic field extraction from VIEW SELECT statements
- Query methods for views (find, findOne)
- New section in documentation about working with views
- Example SQL view file for testing
- Updated examples to demonstrate view usage

## [1.0.3] - 2025-04-24

### Fixed

- Minor documentation improvements

## [1.0.2] - 2025-04-24

### Fixed

- Fixed inconsistency in SQL file examples in README

## [1.0.1] - 2025-04-24

### Changed

- Package metadata improvements

## [1.0.0] - 2025-04-24

### Added

- Initial release of sql-template-js
- Support for SQL templates with tagged template literals
- Parameter type validation (string, integer, float, boolean, date, json)
- JavaScript expressions in SQL templates
- Loading SQL queries from files
- Creating model classes from SQL schemas
- CRUD operations for models
- Comprehensive documentation and examples