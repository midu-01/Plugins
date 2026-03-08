# Employee Manager Learning Flow

## Scope

This walkthrough covers the maintained source files of the plugin:

- `employee-manager.php`
- `includes/Admin.php`
- `includes/Database.php`
- `includes/Settings.php`
- `includes/RestApi.php`
- `src/index.js`
- `src/api.js`
- `src/components/EmployeeApp.js`
- `src/components/EmployeeForm.js`
- `src/components/EmployeeList.js`
- `src/components/SettingsApp.js`
- `src/style.css`
- `package.json`

It does **not** cover `node_modules/` or generated `build/` files.

## A to Z Learning Flow

Read the project in this order:

1. `employee-manager.php`
   Understand plugin bootstrapping, constants, file loading, activation hook, and WordPress action hooks.
2. `includes/Database.php`
   Learn the database schema first, because all employee data depends on this table.
3. `includes/Settings.php`
   Learn what settings exist and how they are stored.
4. `includes/RestApi.php`
   This is the core backend flow: routes, permissions, CRUD, validation, settings API, and response shaping.
5. `includes/Admin.php`
   Learn how the admin pages are created and how data is passed to React.
6. `src/index.js`
   See where React mounts into WordPress admin pages.
7. `src/api.js`
   Learn the frontend-to-backend communication layer.
8. `src/components/EmployeeApp.js`
   This is the main frontend controller for employee CRUD screens.
9. `src/components/EmployeeForm.js`
   Learn how form UI is built from settings.
10. `src/components/EmployeeList.js`
   Learn how employee data is rendered and actions are triggered.
11. `src/components/SettingsApp.js`
   Learn how admins change plugin behavior.
12. `src/style.css`
   Read last, because it only styles behavior you already understand.
13. `package.json`
   Read anytime to understand the build tools and declared packages.

## File-by-File Tables

## 1. `employee-manager.php`

| Line Range | Description |
| --- | --- |
| 1-10 | Plugin header: WordPress reads name, description, version, author, and requirements here. |
| 11-20 | Safety check with `ABSPATH`, then plugin constants are defined for paths, URLs, and version. |
| 21-30 | Loads PHP classes and registers activation plus runtime hooks. |
| 31-31 | Registers settings on `admin_init`. |

## 2. `includes/Admin.php`

| Line Range | Description |
| --- | --- |
| 1-10 | File guard and class start. |
| 11-20 | Creates the top-level admin menu entry for Employees. |
| 21-30 | Adds submenu items for employee list and settings. |
| 31-40 | Settings submenu callback and employee root container renderer. |
| 41-50 | Settings root container renderer and admin page hook filtering. |
| 51-60 | Loads generated asset metadata and enables WordPress media modal support. |
| 61-70 | Enqueues the built JavaScript and CSS files. |
| 71-80 | Sends REST URL, nonce, saved settings, and settings page URL into `window.emData`. |
| 81-83 | Ends the localization payload and class method. |

## 3. `includes/Database.php`

| Line Range | Description |
| --- | --- |
| 1-10 | File guard, class start, and table-name helper beginning. |
| 11-20 | Resolves the custom table name and starts table creation logic. |
| 21-30 | Defines DB columns: id, full name, email, phone, department, photo, timestamps. |
| 31-40 | Runs `dbDelta()` and starts list-query logic. |
| 41-50 | Defines default pagination and sorting arguments; calculates offset. |
| 51-60 | Validates allowed sort fields and starts search query building. |
| 61-70 | Finishes search WHERE clause, counts total rows, starts paged SELECT query. |
| 71-80 | Finalizes employee list query and returns items, total, and total pages. |
| 81-90 | Single employee fetch method and start of create method. |
| 91-100 | Inserts sanitized employee data into the custom table. |
| 101-110 | Returns insert id and starts update logic. |
| 111-120 | Builds update payload for email, phone, and department if present. |
| 121-130 | Adds photo updates, skips empty updates, runs database update. |
| 131-137 | Deletes an employee row by id. |

## 4. `includes/Settings.php`

| Line Range | Description |
| --- | --- |
| 1-10 | File guard, class start, option key definition. |
| 11-20 | Declares default settings: required fields, visible fields, photo upload, placeholders. |
| 21-30 | Returns merged settings from the DB plus defaults. |
| 31-40 | Sanitizes and saves `required_fields` and `visible_fields`. |
| 41-50 | Saves photo toggle and starts placeholder sanitization. |
| 51-60 | Finishes saving and registers the option with WordPress. |
| 61-61 | Class end. |

## 5. `includes/RestApi.php`

| Line Range | Description |
| --- | --- |
| 1-10 | File guard, class start, API namespace constant. |
| 11-20 | Starts `/employees` route registration and defines GET args. |
| 21-30 | Continues GET arg sanitization for page and sorting. |
| 31-40 | Completes GET args and prepares POST route entry. |
| 41-50 | Finalizes create route and starts single employee routes. |
| 51-60 | Adds GET, PUT, DELETE callbacks for `/employees/{id}`. |
| 61-70 | Finishes employee routes and starts `/settings` routes. |
| 71-80 | Completes settings routes and defines general permission check. |
| 81-90 | Defines admin-only permission check and begins list handler. |
| 91-100 | Passes request args to DB and sets REST pagination headers. |
| 101-110 | Returns list response and handles single employee fetch with not-found error. |
| 111-120 | Returns single employee response and starts create validation. |
| 121-130 | Creates employee, handles DB failure, returns new record. |
| 131-140 | Starts update flow and checks whether the employee exists. |
| 141-150 | Validates update payload, runs update, fetches fresh record. |
| 151-160 | Returns updated record and starts delete flow. |
| 161-170 | Deletes employee and returns settings via REST. |
| 171-180 | Saves settings and begins employee validation helper. |
| 181-190 | Validates required full name and email rules. |
| 191-200 | Validates email format and phone required rule. |
| 201-210 | Validates department and image attachment rules. |
| 211-220 | Returns validation errors and starts photo validation helper. |
| 221-230 | Confirms photo is a WordPress image attachment and starts response formatting. |
| 231-240 | Shapes API response fields, including `photo_url` and timestamps. |
| 241-243 | Closes return array and class. |

## 6. `src/index.js`

| Line Range | Description |
| --- | --- |
| 1-10 | Imports React root helpers, app components, CSS, and finds DOM mount points. |
| 11-15 | Mounts employee app or settings app depending on which admin page is loaded. |

## 7. `src/api.js`

| Line Range | Description |
| --- | --- |
| 1-10 | Reads localized REST config and begins employee list request helper. |
| 11-20 | Validates employee list response and returns items plus total counts. |
| 21-30 | Starts create employee request helper. |
| 31-40 | Handles create errors and begins update helper. |
| 41-50 | Sends update request and handles update errors. |
| 51-60 | Returns update result and starts delete helper. |
| 61-70 | Handles delete response and starts settings fetch helper. |
| 71-80 | Returns settings and starts save settings helper. |
| 81-87 | Handles settings save errors and returns saved settings. |

## 8. `src/components/EmployeeApp.js`

| Line Range | Description |
| --- | --- |
| 1-10 | Imports hooks, notices, child components, and API helpers. |
| 11-20 | Defines main state: employees, pagination, search, sorting, view, notice, editing record. |
| 21-30 | Reads localized settings and starts employee loading function. |
| 31-40 | Sends list query and stores employees, totals, and errors. |
| 41-50 | Loads employees on dependency changes and starts auto-dismiss notice effect. |
| 51-60 | Finishes notice effect and computes department count from current page data. |
| 61-70 | Create handler: calls API, shows success, returns to list, reloads data. |
| 71-80 | Update handler: saves edits, resets edit state, reloads data. |
| 81-90 | Delete handler with browser confirmation. |
| 91-100 | Finalizes delete flow and defines edit handler. |
| 101-110 | Defines sort toggling logic and resets page to 1 on sort change. |
| 111-120 | Starts UI render: page title and subtitle change by view. |
| 121-130 | Continues header rendering and add employee button. |
| 131-140 | Settings button in header. |
| 141-150 | Back button for add/edit screens. |
| 151-160 | Notice rendering block. |
| 161-170 | Starts dashboard stats cards section. |
| 171-180 | Renders total employees and department count cards. |
| 181-190 | Renders photo count card and starts employee list component. |
| 191-200 | Passes pagination, search, and sort props into `EmployeeList`. |
| 201-210 | Passes edit/delete callbacks and settings into `EmployeeList`. |
| 211-220 | Starts add form view using `EmployeeForm`. |
| 221-230 | Starts edit form view using `EmployeeForm`. |
| 231-232 | Closes component. |

## 9. `src/components/EmployeeForm.js`

| Line Range | Description |
| --- | --- |
| 1-10 | Imports hooks/components and starts local form state from selected employee. |
| 11-20 | Stores initial photo preview and extracts settings into local helpers. |
| 21-30 | Field updater and WordPress media frame setup for image selection. |
| 31-40 | Saves selected attachment id/url and opens media modal. |
| 41-50 | Remove photo logic and submit handler start. |
| 51-60 | Required-field helper and form card header rendering. |
| 61-70 | Starts form markup and photo upload block. |
| 71-80 | Change/remove photo buttons and dropzone rendering. |
| 81-90 | Upload icon and text hints inside the dropzone. |
| 91-100 | Starts field rows and full name input. |
| 101-110 | Full name input finishes. |
| 111-120 | Starts email field. |
| 121-130 | Email field finishes and phone/department row begins. |
| 131-140 | Phone field rendering. |
| 141-150 | Phone field ends and department field starts. |
| 151-160 | Department field completes. |
| 161-170 | Starts form footer and submit button. |
| 171-180 | Dynamic submit label for create/update states. |
| 181-181 | Component end. |

## 10. `src/components/EmployeeList.js`

| Line Range | Description |
| --- | --- |
| 1-10 | Imports search/spinner components and helper functions start. |
| 11-20 | Finishes initials helper and starts edit icon SVG. |
| 21-30 | Delete icon SVG and component start. |
| 31-40 | Receives props for data, pagination, search, sorting, callbacks, settings. |
| 41-50 | Reads visible fields and starts sort icon helper. |
| 51-60 | Sort icon helper and pagination item range calculation. |
| 61-70 | Starts card render and search toolbar. |
| 71-80 | Loading state and empty state rendering. |
| 81-90 | Empty state finishes and table header begins. |
| 91-100 | Sortable employee/email headers. |
| 101-110 | Continues conditional headers and department sort header. |
| 111-120 | Actions header and table body start. |
| 121-130 | Employee row rendering with avatar/photo/initials. |
| 131-140 | Employee name and email subtext display. |
| 141-150 | Email-only mode and department badge branch start. |
| 151-160 | Department fallback and action buttons wrapper. |
| 161-170 | Edit and delete button behavior. |
| 171-180 | Ends row loop and starts pagination block. |
| 181-190 | Pagination info and previous-page button. |
| 191-200 | Page number generation with ellipsis logic. |
| 201-210 | Renders page buttons. |
| 211-220 | Next-page button and pagination container end. |
| 221-230 | Closes table/list component. |

## 11. `src/components/SettingsApp.js`

| Line Range | Description |
| --- | --- |
| 1-10 | Imports hooks/components and starts field option config. |
| 11-20 | Continues field option config for email and phone. |
| 21-30 | Finishes phone and department config. |
| 31-40 | Starts custom switch UI component. |
| 41-50 | Ends switch and begins row toggle wrapper. |
| 51-60 | Finishes row toggle component. |
| 61-70 | Main settings app state and settings fetch effect. |
| 71-80 | Error notice handling and auto-dismiss effect. |
| 81-90 | Loading UI and helper for array checks. |
| 91-100 | Helper for toggling items inside array settings. |
| 101-110 | Starts field-visibility helper. |
| 111-120 | Finishes visibility helper and starts placeholder updater. |
| 121-130 | Placeholder updater ends and save handler starts. |
| 131-140 | Saves settings and shows success notice. |
| 141-150 | Error branch ends and main layout starts. |
| 151-160 | Settings page header and notice area. |
| 161-170 | Starts first settings section wrapper. |
| 171-180 | Section heading and start of field rows loop. |
| 181-190 | Per-field visibility/required state and row layout. |
| 191-200 | Placeholder input for each field. |
| 201-210 | Visible toggle for each field. |
| 211-220 | Required toggle for each field and row end. |
| 221-230 | Ends first section and starts media section. |
| 231-240 | Media section content and photo setting row. |
| 241-250 | Photo visibility toggle and upload-enabled toggle start. |
| 251-260 | Completes media toggles and starts action footer. |
| 261-270 | Save button and component close. |
| 271-272 | File end. |

## 12. `src/style.css`

This file is very large, so for learning it is better to read by section instead of every 10 lines.

| Line Range | Description |
| --- | --- |
| 1-32 | Global CSS variables: colors, shadows, radius, transitions. |
| 33-152 | Main app shell, header, add/settings/back buttons, and notice styling. |
| 153-223 | Dashboard stat cards. |
| 224-260 | List container and search toolbar. |
| 261-322 | Employee table layout, sortable headers, body cells. |
| 323-369 | Employee avatar, image, initials, and email subtext. |
| 370-428 | Department badge and row action buttons. |
| 429-522 | Empty state, loading state, and pagination UI. |
| 523-609 | Form card, form layout, labels, inputs, and field grid. |
| 610-696 | Photo upload/dropzone/photo preview UI. |
| 697-723 | Form footer and submit button styling. |
| 724-997 | Settings page shell, rows, toggles, inputs, and save area. |
| 998-1054 | Responsive rules for tablet/mobile layouts. |

## 13. `package.json`

| Line Range | Description |
| --- | --- |
| 1-10 | Package name, version, description, and build/start scripts using `wp-scripts`. |
| 11-16 | Declares runtime dependency on `@wordpress/dataviews` and build dependency on `@wordpress/scripts`. |

## Fast Mental Model

If you want to understand the full plugin quickly, use this mental model:

- `employee-manager.php` starts everything.
- `Database.php` defines what data exists.
- `Settings.php` defines what behavior is configurable.
- `RestApi.php` is the backend brain.
- `Admin.php` connects WordPress admin to React.
- `index.js` mounts React.
- `api.js` is the frontend REST bridge.
- `EmployeeApp.js` controls employee-page state.
- `EmployeeForm.js` collects employee input.
- `EmployeeList.js` displays employee data.
- `SettingsApp.js` edits plugin behavior.
- `style.css` only changes appearance.
