<?php

namespace App\Enums;

enum ComplaintStatusEnum: string
{
    case PENDING = 'Pending';
    case IN_PROGRESS = 'In-progress';
    case RESOLVED = 'Resolved';
    case REJECTED = 'Rejected';
}
