<?php

namespace App\Filament\Resources\Cuisines\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class CuisineForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Cuisine Name')
                    ->required()
                    ->maxLength(255),
                    
                Textarea::make('description')
                    ->label('Description')
                    ->required()
                    ->rows(3)
                    ->columnSpanFull(),
                    
                TextInput::make('origin_region')
                    ->label('Origin Region')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('e.g., Jawa Timur, Sumatera Barat'),
                    
                Select::make('category')
                    ->label('Category')
                    ->options([
                        'Main Course' => 'Main Course',
                        'Appetizer' => 'Appetizer',
                        'Dessert' => 'Dessert',
                        'Snack' => 'Snack',
                        'Beverage' => 'Beverage',
                        'Traditional' => 'Traditional',
                    ])
                    ->required(),
                    
                FileUpload::make('photo')
                    ->label('Photo')
                    ->image()
                    ->disk('public')
                    ->directory('cuisines')
                    ->maxSize(1024)
                    ->columnSpanFull(),
            ]);
    }
}
