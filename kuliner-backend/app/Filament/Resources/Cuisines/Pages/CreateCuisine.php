<?php

namespace App\Filament\Resources\Cuisines\Pages;

use App\Filament\Resources\Cuisines\CuisineResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCuisine extends CreateRecord
{
    protected static string $resource = CuisineResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
