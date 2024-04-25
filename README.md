# Next.js SaaS + RBAC

This project contains all the necessary boilerplate to setup a multi-tenant SaaS with Next.js including authentication and RBAC authorization.

## Features

### Authentication

- :ballot_box_with_check: It should be able to authenticate using e-mail & password;
- :ballot_box_with_check: It should be able to authenticate using Github account;
- :ballot_box_with_check: It should be able to recover password using e-mail;
- :ballot_box_with_check: It should be able to create an account (e-mail, name and password);

### Organizations

- :white_large_square: It should be able to create a new organization;
- :white_large_square: It should be able to get organizations to which the user belongs;
- :white_large_square: It should be able to update an organization;
- :white_large_square: It should be able to shutdown an organization;
- :white_large_square: It should be able to transfer organization ownership;

### Invites

- :white_large_square: It should be able to invite a new member (e-mail, role);
- :white_large_square: It should be able to accept an invite;
- :white_large_square: It should be able to revoke a pending invite;

### Members

- :white_large_square: It should be able to get organization members;
- :white_large_square: It should be able to update a member role;

### Projects

- :white_large_square: It should be able to get projects within a organization;
- :white_large_square: It should be able to create a new project (name, url, description);
- :white_large_square: It should be able to update a project (name, url, description);
- :white_large_square: It should be able to delete a project;

### Billing

- :white_large_square: It should be able to get billing details for organization ($20 per project / $10 per member excluding billing role);

## RBAC

Roles & permissions.

### Roles

- Owner (count as administrator)
- Administrator
- Member
- Billing (one per organization)
- Anonymous

### Permissions table

|                          | Administrator | Member | Billing | Anonymous |
| ------------------------ | ------------- | ------ | ------- | --------- |
| Update organization      | ✅            | ❌     | ❌      | ❌        |
| Delete organization      | ✅            | ❌     | ❌      | ❌        |
| Invite a member          | ✅            | ❌     | ❌      | ❌        |
| Revoke an invite         | ✅            | ❌     | ❌      | ❌        |
| List members             | ✅            | ✅     | ✅      | ❌        |
| Transfer ownership       | ⚠️            | ❌     | ❌      | ❌        |
| Update member role       | ✅            | ❌     | ❌      | ❌        |
| Delete member            | ✅            | ⚠️     | ❌      | ❌        |
| List projects            | ✅            | ✅     | ✅      | ❌        |
| Create a new project     | ✅            | ✅     | ❌      | ❌        |
| Update a project         | ✅            | ⚠️     | ❌      | ❌        |
| Delete a project         | ✅            | ⚠️     | ❌      | ❌        |
| Get billing details      | ✅            | ❌     | ✅      | ❌        |
| Export billing details   | ✅            | ❌     | ✅      | ❌        |

> ✅ = allowed
> ❌ = not allowed
> ⚠️ = allowed w/ conditions

#### Conditions

- Only owners may transfer organization ownership;
- Only administrators and project authors may update/delete the project;
- Members can leave their own organization;