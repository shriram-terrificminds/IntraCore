<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class StatusUpdatedNotification extends Notification
{
    use Queueable;

    public $type; // 'complaint' or 'request'
    public $itemOrTitle;
    public $newStatus;
    public $updatedBy;

    public function __construct($type, $itemOrTitle, $newStatus, $updatedBy)
    {
        $this->type = $type;
        $this->itemOrTitle = $itemOrTitle;
        $this->newStatus = $newStatus;
        $this->updatedBy = $updatedBy;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(ucfirst($this->type) . ' Status Updated')
            ->greeting('Hello ' . $notifiable->first_name . ',')
            ->line('The status of your ' . $this->type . ' has been updated.')
            ->line('Details: ' . $this->itemOrTitle)
            ->line('New Status: ' . $this->newStatus)
            ->line('Updated by: ' . $this->updatedBy)
            ->action('View ' . ucfirst($this->type), config(('app.frontend_url')) . '/?tab=' . $this->type === "complaint" ? 'complaints' : 'inventory');
    }
}
