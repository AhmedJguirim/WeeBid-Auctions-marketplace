<?php

namespace App\openapi;

use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Model\PathItem;
use ApiPlatform\Core\OpenApi\Model\Operation;
use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ArrayObject;

class OpenApiFactory implements OpenApiFactoryInterface
{
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
        
    }
    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        /** @var PathItem $path */
        foreach($openApi->getPaths()->getPaths() as $key =>$path){
            if ($path->getGet() && $path->getGet()->getSummary() == 'hidden'){
                $openApi->getPaths()->addPath($key, $path->withGet(null));
            }
        }
        // $schemas = $openApi->getComponents()->getSecuritySchemes();
        // $schemas['bearerAuth'] = new \ArrayObject([
        //     'type' => 'http',
        //     'scheme' => 'bearer',
        //     'bearerFormat' => 'JWT'
        // ]);
        
        $schemas = $openApi->getComponents()->getSchemas();
        $schemas['Credentials'] =  new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'username' => [
                    'type' => 'string',
                    'exemple' => 'admin@admin.com'
                ],
                'password' => [
                    'type' => 'string',
                    'exemple' => '0000'
                ]
            ]
        ]);

        $pathItem = new PathItem(
            post: new Operation(
                operationId:'myLogin',
                tags: ['Auth'],
                requestBody: new RequestBody(
                    content: new \ArrayObject([
                        "application/json" =>[
                            'schema' => [
                                '$ref' => '#/components/schemas/Credentials'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => [
                        'description' => 'ustilisateur connecté',
                        'content' => [
                            'application/json' => [
                                'schema'=> [
                                    '$ref' => '#/components/schemas/User-read.user.collection'
                                ]
                            ]
                        ]
                    ],
                    
                ]
            ),

        );
        $openApi->getPaths()->addPath('/api/login_check' , $pathItem);

        
        $pathItem = new PathItem(
            post: new Operation(
                operationId:'myLogout',
                tags: ['Auth'],
                responses: [
                    '204' => [],
                    
                ]
            ),

        );
        $openApi->getPaths()->addPath('/api/logout' , $pathItem);
        return $openApi;
    }
}
