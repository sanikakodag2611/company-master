<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Departments List</title>
</head>
<body>
    <h2>All Departments</h2>
<a href="{{ route('department.create')}}">Create Department</a>
    <table border="1" cellpadding="8" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Abbreviation</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($departments as $department)
                <tr>
                    <td>{{ $department->id }}</td>
                    <td>{{ $department->department_name }}</td>
                    <td>{{ $department->department_abbreviation}}</td>
                    <td>{{ $department->status == 1 ? 'Active' : 'Inactive' }}</td>
                    <td>
                        <a href="{{ route('department.edit', $department->id) }}">Edit</a>
                    </td>
                     
                </tr>
            @empty
                <tr>
                    <td colspan="5">No departments found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
