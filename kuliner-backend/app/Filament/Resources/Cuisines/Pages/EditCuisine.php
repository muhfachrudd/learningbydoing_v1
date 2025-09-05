<?php

namespace App\Filament\Resources\Cuisines\Pages;

use App\Filament\Resources\Cuisines\CuisineResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCuisine extends EditRecord
{
    protected static string $resource = CuisineResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
