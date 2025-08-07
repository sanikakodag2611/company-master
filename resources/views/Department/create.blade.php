<!DOCTYPE html>
<html>
<head>
    <title>Add Department</title>
</head>
<body>

    <h2>Add Department</h2>

    <form action="{{ route('department.store') }}" method="POST">
        @csrf

        <label for="department_name">Department Name:</label><br>
        <input type="text" id="department_name" name="department_name" required><br><br>

        <label for="department_name">Department abbreviation:</label><br>
        <input type="text" id="department_abbreviation" name="department_abbreviation" required><br><br>

        <label for="status">Status:</label><br>
        <select id="status" name="status" required>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
        </select><br><br>

        <button type="submit">Save Department</button>
    </form>

</body>
</html>
