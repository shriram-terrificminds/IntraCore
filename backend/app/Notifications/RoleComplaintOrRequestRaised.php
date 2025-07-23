<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class RoleComplaintOrRequestRaised extends Notification
{
    use Queueable;

    public $type; // 'complaint' or 'request'
    public $itemOrTitle;
    public $raisedBy;
    public $roleName;

    public function __construct($type, $itemOrTitle, $raisedBy, $roleName)
    {
        $this->type = $type;
        $this->itemOrTitle = $itemOrTitle;
        $this->raisedBy = $raisedBy;
        $this->roleName = $roleName;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(ucfirst($this->type) . ' Raised for ' . $this->roleName)
            ->greeting('Hello ' . $notifiable->first_name . ',')
            ->line('A new ' . $this->type . ' has been raised and assigned to your role (' . $this->roleName . ').')
            ->line('Details: ' . $this->itemOrTitle)
            ->line('Raised by: ' . $this->raisedBy)
            ->action('View ' . ucfirst($this->type), config(('app.frontend_url')) . '/?tab=' . $this->type === "complaint" ? 'complaints' : 'inventory');
    }
}
