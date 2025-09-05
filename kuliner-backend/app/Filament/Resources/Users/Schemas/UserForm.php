<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Full Name')
                    ->required()
                    ->maxLength(255),
                    
                TextInput::make('email')
                    ->label('Email Address')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                    
                TextInput::make('password')
                    ->label('Password')
                    ->password()
                    ->required(fn (string $context): bool => $context === 'create')
                    ->maxLength(255)
                    ->placeholder('Leave blank to keep current password'),
                    
                Select::make('role')
                    ->label('Role')
                    ->options([
                        'user' => 'User',
                        'admin' => 'Admin',
                    ])
                    ->default('user')
                    ->required(),
                    
                FileUpload::make('avatar')
                    ->label('Avatar')
                    ->image()
                    ->directory('avatars')
                    ->maxSize(512)
                    ->columnSpanFull(),
            ]);
    }
}
