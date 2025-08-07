<!DOCTYPE html>
<html>
<head>
    <title>Edit Department</title>
</head>
<body>

    <h2>Edit Department</h2>

    <form action="{{ route('department.update', $department->id) }}" method="POST">
        @csrf

        <label for="department_name">Department Name:</label><br>
        <input type="text" id="department_name" name="department_name" value="{{ $department->department_name }}" required><br><br>

        <label for="department_abbreviation">Department abbreviation</label><br>
        <input type="text" id="department_abbreviation" name="department_abbreviation" value="{{ $department->department_abbreviation }}" required><br><br>


        <label for="status">Status:</label><br>
        <select id="status" name="status" required>
            <option value="1" {{ $department->status == 1 ? 'selected' : '' }}>Active</option>
            <option value="0" {{ $department->status == 0 ? 'selected' : '' }}>Inactive</option>
        </select><br><br>

        <button type="submit">Update Department</button>
    </form>

</body>
</html>
