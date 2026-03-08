/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js"
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEmployee: () => (/* binding */ createEmployee),
/* harmony export */   deleteEmployee: () => (/* binding */ deleteEmployee),
/* harmony export */   fetchEmployees: () => (/* binding */ fetchEmployees),
/* harmony export */   fetchSettings: () => (/* binding */ fetchSettings),
/* harmony export */   saveSettings: () => (/* binding */ saveSettings),
/* harmony export */   updateEmployee: () => (/* binding */ updateEmployee)
/* harmony export */ });
const {
  restUrl,
  nonce
} = window.emData;
const headers = {
  'Content-Type': 'application/json',
  'X-WP-Nonce': nonce
};
async function fetchEmployees(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${restUrl}employees?${query}`, {
    headers
  });
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  const data = await response.json();
  return {
    items: data,
    total: parseInt(response.headers.get('X-WP-Total'), 10),
    totalPages: parseInt(response.headers.get('X-WP-TotalPages'), 10)
  };
}
async function createEmployee(data) {
  const response = await fetch(`${restUrl}employees`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create employee');
  }
  return response.json();
}
async function updateEmployee(id, data) {
  const response = await fetch(`${restUrl}employees/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update employee');
  }
  return response.json();
}
async function deleteEmployee(id) {
  const response = await fetch(`${restUrl}employees/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
  return response.json();
}
async function fetchSettings() {
  const response = await fetch(`${restUrl}settings`, {
    headers
  });
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}
async function saveSettings(data) {
  const response = await fetch(`${restUrl}settings`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to save settings');
  }
  return response.json();
}

/***/ },

/***/ "./src/components/EmployeeApp.js"
/*!***************************************!*\
  !*** ./src/components/EmployeeApp.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmployeeApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _EmployeeList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EmployeeList */ "./src/components/EmployeeList.js");
/* harmony import */ var _EmployeeForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EmployeeForm */ "./src/components/EmployeeForm.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api */ "./src/api.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function EmployeeApp() {
  const [employees, setEmployees] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [total, setTotal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalPages, setTotalPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [page, setPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [perPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(10);
  const [search, setSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [sortField, setSortField] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('id');
  const [sortOrder, setSortOrder] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('desc');
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [notice, setNotice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [view, setView] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('list');
  const [editingEmployee, setEditingEmployee] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const settings = window.emData.settings;
  const settingsUrl = window.emData.settingsUrl;
  const loadEmployees = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setLoading(true);
    try {
      const result = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.fetchEmployees)({
        page,
        per_page: perPage,
        orderby: sortField,
        order: sortOrder,
        search
      });
      setEmployees(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message
      });
    }
    setLoading(false);
  }, [page, perPage, sortField, sortOrder, search]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Auto-dismiss notices after 4s
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  const departments = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const deptSet = new Set(employees.map(e => e.department).filter(Boolean));
    return deptSet.size;
  }, [employees]);
  const handleCreate = async data => {
    try {
      await (0,_api__WEBPACK_IMPORTED_MODULE_5__.createEmployee)(data);
      setNotice({
        type: 'success',
        message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Employee created successfully.', 'employee-manager')
      });
      setView('list');
      setPage(1);
      loadEmployees();
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message
      });
    }
  };
  const handleUpdate = async data => {
    try {
      await (0,_api__WEBPACK_IMPORTED_MODULE_5__.updateEmployee)(editingEmployee.id, data);
      setNotice({
        type: 'success',
        message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Employee updated successfully.', 'employee-manager')
      });
      setView('list');
      setEditingEmployee(null);
      loadEmployees();
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message
      });
    }
  };
  const handleDelete = async id => {
    if (!window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Are you sure you want to delete this employee?', 'employee-manager'))) {
      return;
    }
    try {
      await (0,_api__WEBPACK_IMPORTED_MODULE_5__.deleteEmployee)(id);
      setNotice({
        type: 'success',
        message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Employee deleted.', 'employee-manager')
      });
      loadEmployees();
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message
      });
    }
  };
  const handleEdit = employee => {
    setEditingEmployee(employee);
    setView('edit');
  };
  const handleSort = field => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "em-app",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "em-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "em-header-left",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
          children: view === 'list' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Employee Manager', 'employee-manager') : view === 'add' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add Employee', 'employee-manager') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Edit Employee', 'employee-manager')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "em-subtitle",
          children: view === 'list' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Manage your team members and their information', 'employee-manager') : view === 'add' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Fill in the details to add a new team member', 'employee-manager') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Update employee information', 'employee-manager')
        })]
      }), view === 'list' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "em-header-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("button", {
          className: "em-btn-add",
          onClick: () => setView('add'),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("line", {
              x1: "12",
              y1: "5",
              x2: "12",
              y2: "19"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("line", {
              x1: "5",
              y1: "12",
              x2: "19",
              y2: "12"
            })]
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add Employee', 'employee-manager')]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
          className: "em-btn-settings",
          href: settingsUrl,
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings', 'employee-manager'),
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings', 'employee-manager'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            width: "18",
            height: "18",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("circle", {
              cx: "12",
              cy: "12",
              r: "3"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
              d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            })]
          })
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("button", {
        className: "em-btn-back",
        onClick: () => {
          setView('list');
          setEditingEmployee(null);
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          width: "16",
          height: "16",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("polyline", {
            points: "15 18 9 12 15 6"
          })
        }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Back to List', 'employee-manager')]
      })]
    }), notice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
      status: notice.type,
      isDismissible: true,
      onDismiss: () => setNotice(null),
      children: notice.message
    }), view === 'list' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "em-stats",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "em-stat-card",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-icon blue",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              width: "22",
              height: "22",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("circle", {
                cx: "9",
                cy: "7",
                r: "4"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                d: "M23 21v-2a4 4 0 0 0-3-3.87"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                d: "M16 3.13a4 4 0 0 1 0 7.75"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-value",
            children: total
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-label",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Total Employees', 'employee-manager')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "em-stat-card",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-icon green",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              width: "22",
              height: "22",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("rect", {
                x: "2",
                y: "7",
                width: "20",
                height: "14",
                rx: "2",
                ry: "2"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-value",
            children: departments
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-label",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Departments', 'employee-manager')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "em-stat-card",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-icon orange",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              width: "22",
              height: "22",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                d: "M22 12h-4l-3 9L9 3l-3 9H2"
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-value",
            children: employees.filter(e => e.photo_url).length
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "em-stat-label",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('With Photos', 'employee-manager')
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_EmployeeList__WEBPACK_IMPORTED_MODULE_3__["default"], {
        employees: employees,
        loading: loading,
        total: total,
        totalPages: totalPages,
        page: page,
        perPage: perPage,
        onPageChange: setPage,
        search: search,
        onSearchChange: val => {
          setSearch(val);
          setPage(1);
        },
        sortField: sortField,
        sortOrder: sortOrder,
        onSort: handleSort,
        onEdit: handleEdit,
        onDelete: handleDelete,
        settings: settings
      })]
    }), view === 'add' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "em-form-view",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_EmployeeForm__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onSubmit: handleCreate,
        settings: settings
      })
    }), view === 'edit' && editingEmployee && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "em-form-view",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_EmployeeForm__WEBPACK_IMPORTED_MODULE_4__["default"], {
        employee: editingEmployee,
        onSubmit: handleUpdate,
        settings: settings
      })
    })]
  });
}

/***/ },

/***/ "./src/components/EmployeeForm.js"
/*!****************************************!*\
  !*** ./src/components/EmployeeForm.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmployeeForm)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function EmployeeForm({
  employee,
  onSubmit,
  settings
}) {
  const [formData, setFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    full_name: employee?.full_name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    department: employee?.department || '',
    photo_id: employee?.photo_id || 0
  });
  const [photoPreview, setPhotoPreview] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(employee?.photo_url || '');
  const [submitting, setSubmitting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const visibleFields = settings.visible_fields || [];
  const requiredFields = settings.required_fields || [];
  const placeholders = settings.placeholders || {};
  const photoUploadEnabled = settings.photo_upload;
  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  const handlePhotoSelect = () => {
    const frame = wp.media({
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Profile Photo', 'employee-manager'),
      multiple: false,
      library: {
        type: 'image'
      }
    });
    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();
      updateField('photo_id', attachment.id);
      setPhotoPreview(attachment.url);
    });
    frame.open();
  };
  const handleRemovePhoto = () => {
    updateField('photo_id', 0);
    setPhotoPreview('');
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
  };
  const isRequired = field => requiredFields.includes(field);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "em-form-card",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "em-form-card-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
        children: employee ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Employee Details', 'employee-manager') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('New Employee', 'employee-manager')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        children: employee ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Update the information below', 'employee-manager') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Fill in the details for the new team member', 'employee-manager')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
      onSubmit: handleSubmit,
      className: "em-form",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "em-form-body",
        children: [visibleFields.includes('photo') && photoUploadEnabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "em-photo-upload",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Profile Photo', 'employee-manager')
          }), photoPreview ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "em-photo-selected",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
              src: photoPreview,
              alt: ""
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
              className: "em-photo-selected-actions",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                variant: "secondary",
                size: "small",
                onClick: handlePhotoSelect,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Change Photo', 'employee-manager')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                variant: "link",
                isDestructive: true,
                size: "small",
                onClick: handleRemovePhoto,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove', 'employee-manager')
              })]
            })]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "em-photo-dropzone",
            onClick: handlePhotoSelect,
            role: "button",
            tabIndex: 0,
            onKeyDown: e => e.key === 'Enter' && handlePhotoSelect(),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "em-upload-icon",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                width: "24",
                height: "24",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
                  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("polyline", {
                  points: "17 8 12 3 7 8"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("line", {
                  x1: "12",
                  y1: "3",
                  x2: "12",
                  y2: "15"
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Click to upload', 'employee-manager')
              }), " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('a profile photo', 'employee-manager')]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
              className: "em-upload-hint",
              children: ["PNG, JPG ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('up to 2MB', 'employee-manager')]
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "em-field-row",
          children: [visibleFields.includes('full_name') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "em-field-group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Full Name', 'employee-manager'), isRequired('full_name') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "em-required",
                children: "*"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "text",
              value: formData.full_name,
              onChange: e => updateField('full_name', e.target.value),
              placeholder: placeholders.full_name || '',
              required: isRequired('full_name')
            })]
          }), visibleFields.includes('email') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "em-field-group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Email Address', 'employee-manager'), isRequired('email') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "em-required",
                children: "*"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "email",
              value: formData.email,
              onChange: e => updateField('email', e.target.value),
              placeholder: placeholders.email || '',
              required: isRequired('email')
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "em-field-row",
          children: [visibleFields.includes('phone') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "em-field-group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Phone Number', 'employee-manager'), isRequired('phone') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "em-required",
                children: "*"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "tel",
              value: formData.phone,
              onChange: e => updateField('phone', e.target.value),
              placeholder: placeholders.phone || '',
              required: isRequired('phone')
            })]
          }), visibleFields.includes('department') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "em-field-group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Department', 'employee-manager'), isRequired('department') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                className: "em-required",
                children: "*"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "text",
              value: formData.department,
              onChange: e => updateField('department', e.target.value),
              placeholder: placeholders.department || '',
              required: isRequired('department')
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "em-form-footer",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "submit",
          className: "em-btn-submit",
          disabled: submitting,
          children: submitting ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Saving...', 'employee-manager') : employee ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Update Employee', 'employee-manager') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Create Employee', 'employee-manager')
        })
      })]
    })]
  });
}

/***/ },

/***/ "./src/components/EmployeeList.js"
/*!****************************************!*\
  !*** ./src/components/EmployeeList.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmployeeList)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function getAvatarClass(id) {
  return 'bg-' + (id % 6 + 1);
}
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return parts[0].substring(0, 2);
}
const EditIcon = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
    d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
    d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  })]
});
const DeleteIcon = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
    points: "3 6 5 6 21 6"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  })]
});
function EmployeeList({
  employees,
  loading,
  total,
  totalPages,
  page,
  perPage,
  onPageChange,
  search,
  onSearchChange,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  settings
}) {
  const visibleFields = settings.visible_fields || [];
  const getSortIcon = field => {
    if (sortField !== field) return null;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "em-sort-icon",
      children: sortOrder === 'asc' ? '\u25B2' : '\u25BC'
    });
  };
  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "em-list-card",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "em-list-toolbar",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SearchControl, {
        value: search,
        onChange: onSearchChange,
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search by name, email or department...', 'employee-manager')
      })
    }), loading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "em-loading",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Spinner, {})
    }) : employees.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "em-empty-state",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "em-empty-icon",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.5",
          width: "32",
          height: "32",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("circle", {
            cx: "9",
            cy: "7",
            r: "4"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M23 21v-2a4 4 0 0 0-3-3.87"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M16 3.13a4 4 0 0 1 0 7.75"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No employees yet', 'employee-manager')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get started by adding your first team member.', 'employee-manager')
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("table", {
        className: "em-table",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("thead", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
            children: [visibleFields.includes('full_name') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("th", {
              className: "em-sortable",
              onClick: () => onSort('full_name'),
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Employee', 'employee-manager'), getSortIcon('full_name')]
            }), visibleFields.includes('email') && !visibleFields.includes('full_name') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("th", {
              className: "em-sortable",
              onClick: () => onSort('email'),
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email', 'employee-manager'), getSortIcon('email')]
            }), visibleFields.includes('phone') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Phone', 'employee-manager')
            }), visibleFields.includes('department') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("th", {
              className: "em-sortable",
              onClick: () => onSort('department'),
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Department', 'employee-manager'), getSortIcon('department')]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Actions', 'employee-manager')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("tbody", {
          children: employees.map(emp => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
            children: [visibleFields.includes('full_name') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                className: "em-employee-info",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                  className: `em-avatar ${getAvatarClass(emp.id)}`,
                  children: emp.photo_url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
                    src: emp.photo_url,
                    alt: emp.full_name
                  }) : getInitials(emp.full_name)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                    className: "em-employee-name",
                    children: emp.full_name
                  }), visibleFields.includes('email') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                    className: "em-employee-email-sub",
                    children: emp.email
                  })]
                })]
              })
            }), visibleFields.includes('email') && !visibleFields.includes('full_name') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
              children: emp.email
            }), visibleFields.includes('phone') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
              children: emp.phone || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                style: {
                  color: '#9ca3af'
                },
                children: "\u2014"
              })
            }), visibleFields.includes('department') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
              children: emp.department ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                className: "em-dept-badge",
                children: emp.department
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                style: {
                  color: '#9ca3af'
                },
                children: "\u2014"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
                className: "em-row-actions",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
                  className: "em-action-btn",
                  onClick: () => onEdit(emp),
                  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit', 'employee-manager'),
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(EditIcon, {})
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
                  className: "em-action-btn delete",
                  onClick: () => onDelete(emp.id),
                  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete', 'employee-manager'),
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(DeleteIcon, {})
                })]
              })
            })]
          }, emp.id))
        })]
      }), totalPages > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "em-pagination",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "em-pagination-info",
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Showing', 'employee-manager'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("strong", {
            children: [startItem, "\u2013", endItem]
          }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('of', 'employee-manager'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("strong", {
            children: total
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "em-pagination-buttons",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            className: "em-page-btn",
            disabled: page <= 1,
            onClick: () => onPageChange(page - 1),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              width: "16",
              height: "16",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
                points: "15 18 9 12 15 6"
              })
            })
          }), Array.from({
            length: totalPages
          }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, idx, arr) => {
            const items = [];
            if (idx > 0 && arr[idx - 1] < p - 1) {
              items.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                className: "em-page-btn",
                style: {
                  border: 'none',
                  cursor: 'default'
                },
                children: "..."
              }, `dots-${p}`));
            }
            items.push(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
              className: `em-page-btn ${p === page ? 'current' : ''}`,
              onClick: () => onPageChange(p),
              children: p
            }, p));
            return items;
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            className: "em-page-btn",
            disabled: page >= totalPages,
            onClick: () => onPageChange(page + 1),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              width: "16",
              height: "16",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
                points: "9 18 15 12 9 6"
              })
            })
          })]
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./src/components/SettingsApp.js"
/*!***************************************!*\
  !*** ./src/components/SettingsApp.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api */ "./src/api.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const FIELD_OPTIONS = [{
  key: 'full_name',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Full Name', 'employee-manager'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Primary name field shown in the form and employee table.', 'employee-manager'),
  placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enter full name', 'employee-manager')
}, {
  key: 'email',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Email', 'employee-manager'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Used for employee contact details and list display.', 'employee-manager'),
  placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enter email address', 'employee-manager')
}, {
  key: 'phone',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Phone', 'employee-manager'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Optional contact number field for employee records.', 'employee-manager'),
  placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enter phone number', 'employee-manager')
}, {
  key: 'department',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Department', 'employee-manager'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Organize employees by their assigned department.', 'employee-manager'),
  placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enter department', 'employee-manager')
}];
function SwitchControl({
  label,
  checked,
  onChange,
  disabled = false
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
    className: `em-switch ${disabled ? 'is-disabled' : ''}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
      className: "screen-reader-text",
      children: label
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
      type: "checkbox",
      checked: checked,
      onChange: event => onChange(event.target.checked),
      disabled: disabled
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
      className: "em-switch-track",
      "aria-hidden": "true",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "em-switch-thumb"
      })
    })]
  });
}
function RowToggle({
  label,
  checked,
  onChange,
  disabled = false
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "em-settings-toggle",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
      className: "em-settings-toggle__label",
      children: label
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(SwitchControl, {
      label: label,
      checked: checked,
      onChange: onChange,
      disabled: disabled
    })]
  });
}
function SettingsApp() {
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [notice, setNotice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_3__.fetchSettings)().then(setSettings).catch(err => {
      setNotice({
        type: 'error',
        message: err.message
      });
    });
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  if (!settings) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "em-loading",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {})
    });
  }
  const hasArrayValue = (key, value) => settings[key]?.includes(value);
  const updateArraySetting = (key, value, enabled) => {
    const currentValues = settings[key] || [];
    const nextValues = enabled ? [...new Set([...currentValues, value])] : currentValues.filter(item => item !== value);
    setSettings({
      ...settings,
      [key]: nextValues
    });
  };
  const updateFieldVisibility = (fieldKey, enabled) => {
    const nextVisibleFields = enabled ? [...new Set([...(settings.visible_fields || []), fieldKey])] : (settings.visible_fields || []).filter(item => item !== fieldKey);
    const nextRequiredFields = enabled ? settings.required_fields || [] : (settings.required_fields || []).filter(item => item !== fieldKey);
    setSettings({
      ...settings,
      visible_fields: nextVisibleFields,
      required_fields: nextRequiredFields
    });
  };
  const updatePlaceholder = (fieldKey, value) => {
    setSettings({
      ...settings,
      placeholders: {
        ...settings.placeholders,
        [fieldKey]: value
      }
    });
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.saveSettings)(settings);
      setSettings(updated);
      setNotice({
        type: 'success',
        message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings saved successfully.', 'employee-manager')
      });
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message
      });
    }
    setSaving(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "em-settings",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "em-settings-shell",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "em-settings-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "em-settings-header__top",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings', 'employee-manager')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "em-settings-eyebrow",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Employee Manager', 'employee-manager')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Manage field visibility, validation, and media behavior from one clean settings screen.', 'employee-manager')
        })]
      }), notice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: notice.type,
        isDismissible: true,
        onDismiss: () => setNotice(null),
        children: notice.message
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "em-settings-section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "em-settings-section__header",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Employee Fields', 'employee-manager')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Each field stays on its own row so you can control visibility, required status, and placeholder text without switching tabs.', 'employee-manager')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "em-settings-list",
          children: FIELD_OPTIONS.map(field => {
            const isVisible = hasArrayValue('visible_fields', field.key);
            const isRequired = hasArrayValue('required_fields', field.key);
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "em-settings-row",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "em-settings-row__info",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
                  children: field.label
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                  children: field.description
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "em-settings-row__controls",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
                  className: "em-settings-input",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                    className: "em-settings-input__label",
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Placeholder text', 'employee-manager')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                    type: "text",
                    value: settings.placeholders?.[field.key] || '',
                    placeholder: field.placeholder,
                    onChange: event => updatePlaceholder(field.key, event.target.value),
                    disabled: !isVisible
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                  className: "em-settings-row__toggles",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(RowToggle, {
                    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Visible', 'employee-manager'),
                    checked: isVisible,
                    onChange: enabled => updateFieldVisibility(field.key, enabled)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(RowToggle, {
                    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Required', 'employee-manager'),
                    checked: isRequired,
                    onChange: enabled => updateArraySetting('required_fields', field.key, enabled),
                    disabled: !isVisible
                  })]
                })]
              })]
            }, field.key);
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "em-settings-section",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "em-settings-section__header",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Media', 'employee-manager')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Control whether the profile photo field is shown and whether uploads are allowed in the employee form.', 'employee-manager')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "em-settings-list",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "em-settings-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "em-settings-row__info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Profile Photo', 'employee-manager')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Display the profile photo field in the form and allow users to upload or change employee photos.', 'employee-manager')
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "em-settings-row__controls",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "em-settings-row__toggles",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(RowToggle, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Visible', 'employee-manager'),
                  checked: hasArrayValue('visible_fields', 'photo'),
                  onChange: enabled => updateArraySetting('visible_fields', 'photo', enabled)
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(RowToggle, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Uploads enabled', 'employee-manager'),
                  checked: !!settings.photo_upload,
                  onChange: enabled => setSettings({
                    ...settings,
                    photo_upload: enabled
                  }),
                  disabled: !hasArrayValue('visible_fields', 'photo')
                })]
              })
            })]
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "em-settings-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          className: "em-btn-submit",
          onClick: handleSave,
          disabled: saving,
          children: saving ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Saving...', 'employee-manager') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Save Settings', 'employee-manager')
        })
      })]
    })
  });
}

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_EmployeeApp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/EmployeeApp */ "./src/components/EmployeeApp.js");
/* harmony import */ var _components_SettingsApp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/SettingsApp */ "./src/components/SettingsApp.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const employeeRoot = document.getElementById('employee-manager-app');
const settingsRoot = document.getElementById('employee-manager-settings');
if (employeeRoot) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(employeeRoot).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_EmployeeApp__WEBPACK_IMPORTED_MODULE_1__["default"], {}));
}
if (settingsRoot) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(settingsRoot).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_SettingsApp__WEBPACK_IMPORTED_MODULE_2__["default"], {}));
}

/***/ },

/***/ "./src/style.css"
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkemployee_manager"] = globalThis["webpackChunkemployee_manager"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map