<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Response;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Event\LogoutEvent;

class LogoutSubscriber implements EventSubscriberInterface
{
    public function onLogoutEvent(LogoutEvent $event)
    {
        $event->setResponse(new JsonResponse());
    }

    public static function getSubscribedEvents()
    {
        return [
            LogoutEvent::class => 'onLogoutEvent'
        ];
    }
}
