<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'Admin';
    case HR = 'Hr';
    case DEVOPS = 'Devops';
    case EMPLOYEE = 'Employee';
}
