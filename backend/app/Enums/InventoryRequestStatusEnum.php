<?php

namespace App\Enums;

enum InventoryRequestStatusEnum: string
{
    case PENDING = 'Pending';
    case APPROVED = 'Approved';
    case SHIPPED = 'Shipped';
    case RECEIVED = 'Received';
    case REJECTED = 'Rejected';
}
