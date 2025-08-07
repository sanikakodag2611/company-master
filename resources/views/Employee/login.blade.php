<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
     <form action="{{ route('') }}" method="POST">
        @csrf

        <label for="">:</label><br>
        <select id="" name=" " required>        
          <option value="{{ $employee->id }}" >Select</option>           
        </select><br><br>

        <label for="username"> Username:</label><br>
        <input type="text" id="username" name="username" value="{{ $employee->username}}" required><br><br>

        <label for="password">Password</label><br>
        <input type="text" id="password" name="password" value="{{ $employee->password}}" required><br><br>

        
        <button type="submit">Submit</button>
    </form>

</body>
</html>