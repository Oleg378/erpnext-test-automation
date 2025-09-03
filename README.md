# Test Automation Framework

This project is a modern test automation framework built with **TypeScript** and **Playwright**, designed to deliver maintainable, readable, and scalable automated tests.

---

## Overview

The framework uses a **component-based design** combined with a **custom Playwright wrapper** to simplify test code and improve flexibility. It separates concerns, making tests easy to write, understand, and maintain.

---

## Core Concepts

### 1. Component-Based UI Modeling
UI is broken down into small, reusable components (e.g., buttons, forms, menus). These components compose page objects, enabling code reuse and easier maintenance.

### 2. Playwright Wrapper 
A custom wrapper around Playwright’s API abstracts common browser interactions and test utilities, reducing boilerplate in tests and pages.

### 3. Allure Reporting System
**Allure Report** integration provides test execution results with detailed step-by-step information.

### 4. Session Context
A shared session context stores information about the current user, roles, or test environment, allowing pages and tests to adapt dynamically without relying on global variables.

### 5. Flows (Business Process Orchestration)
Complex multi-step workflows are planned to be implemented in a flows layer. These flows orchestrate interactions across multiple pages and components to represent real business scenarios.

---

[//]: # (## Project Structure)

