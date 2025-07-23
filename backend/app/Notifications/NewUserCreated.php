<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserCreated extends Notification
{
    use Queueable;

    public $user;
    public $plainPassword;

    public function __construct($user, $plainPassword)
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
    }

    /**
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Welcome to IntraCore')
            ->greeting('Hello ' . $this->user->first_name . '!')
            ->line('Your account has been created.')
            ->line('Email: ' . $this->user->email)
            ->line('Password: ' . $this->plainPassword)
            ->action('Login', config(('app.frontend_url')))
            ->line('Please reset your password before logging in.');
    }
}
