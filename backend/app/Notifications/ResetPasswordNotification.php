<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as LaravelResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends LaravelResetPassword
{
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $this->token);
        }

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $this->createUrl($notifiable))
            ->line('This password reset link will expire in ' . config('auth.passwords.users.expire') . ' minutes.')
            ->line('If you did not request a password reset, no further action is required.')
            ->line('Regards, IntraCore');
    }

    /**
     * Create a new URL for the password reset.
     *
     * @param  mixed  $notifiable
     * @return string
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    protected function createUrl($notifiable)
    {
        return config('app.frontend_url') . '/reset-password?token=' . $this->token;
    }
}
