<?php

namespace App\Filament\Resources\Vendors\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class VendorForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('cuisine_id')
                    ->label('Cuisine Type')
                    ->relationship('cuisine', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                    
                TextInput::make('name')
                    ->label('Vendor Name')
                    ->required()
                    ->maxLength(255),
                    
                Textarea::make('address')
                    ->label('Address')
                    ->required()
                    ->rows(3)
                    ->columnSpanFull(),
                    
                TextInput::make('latitude')
                    ->label('Latitude')
                    ->numeric()
                    ->step(0.00000001)
                    ->required()
                    ->placeholder('e.g., -6.200000'),
                    
                TextInput::make('longitude')
                    ->label('Longitude')
                    ->numeric()
                    ->step(0.00000001)
                    ->required()
                    ->placeholder('e.g., 106.816666'),
                    
                TextInput::make('opening_hours')
                    ->label('Opening Hours')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('e.g., 08:00 - 22:00'),
                    
                Select::make('price_range')
                    ->label('Price Range')
                    ->options([
                        'Budget' => 'Budget (< Rp 50,000)',
                        'Mid-range' => 'Mid-range (Rp 50,000 - 150,000)',
                        'Premium' => 'Premium (> Rp 150,000)',
                    ])
                    ->required(),
                    
                TextInput::make('contact')
                    ->label('Contact')
                    ->maxLength(255)
                    ->placeholder('Phone number or WhatsApp'),
                    
                FileUpload::make('photo')
                    ->label('Photo')
                    ->image()
                    ->disk('public')
                    ->directory('vendors')
                    ->maxSize(1024)
                    ->columnSpanFull(),
            ]);
    }
}
