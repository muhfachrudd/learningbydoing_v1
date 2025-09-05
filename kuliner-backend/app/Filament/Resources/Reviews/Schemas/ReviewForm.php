<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                    
                Select::make('vendor_id')
                    ->label('Vendor')
                    ->relationship('vendor', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                    
                Select::make('rating')
                    ->label('Rating')
                    ->options([
                        1 => '1 Star - Poor',
                        2 => '2 Stars - Fair',
                        3 => '3 Stars - Good',
                        4 => '4 Stars - Very Good',
                        5 => '5 Stars - Excellent',
                    ])
                    ->required(),
                    
                Textarea::make('review_text')
                    ->label('Review Text')
                    ->required()
                    ->rows(4)
                    ->maxLength(1000)
                    ->columnSpanFull(),
                    
                FileUpload::make('photo')
                    ->label('Photo')
                    ->image()
                    ->directory('reviews')
                    ->maxSize(1024)
                    ->columnSpanFull(),
            ]);
    }
}
