<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <h1>Reset Password</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="{{ url('reset-password', $token) }}">Reset Password</a>
</body>
</html> 