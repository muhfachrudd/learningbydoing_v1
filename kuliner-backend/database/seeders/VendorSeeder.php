<?php

namespace Database\Seeders;

use App\Models\Vendor;
use App\Models\Cuisine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendors = [
            // Rendang vendors
            [
                'cuisine_id' => 1, // Rendang
                'name' => 'Rumah Makan Padang Sederhana',
                'address' => 'Jl. Sabang No. 61, Jakarta Pusat',
                'latitude' => -6.1830,
                'longitude' => 106.8290,
                'opening_hours' => '10:00-22:00',
                'price_range' => '50000-100000',
                'contact' => '021-3193718',
            ],
            [
                'cuisine_id' => 1, // Rendang
                'name' => 'Warung Tekko',
                'address' => 'Jl. Kebon Sirih Timur Dalam No. 17A, Jakarta Pusat',
                'latitude' => -6.1850,
                'longitude' => 106.8270,
                'opening_hours' => '11:00-21:00',
                'price_range' => '30000-75000',
                'contact' => '021-3904576',
            ],
            
            // Gudeg vendors
            [
                'cuisine_id' => 2, // Gudeg
                'name' => 'Gudeg Yu Djum',
                'address' => 'Jl. Kemetiran Kidul No. 13, Pringgokusuman, Gedongtengen, Yogyakarta',
                'latitude' => -7.7956,
                'longitude' => 110.3695,
                'opening_hours' => '06:00-12:00',
                'price_range' => '15000-30000',
                'contact' => '0274-561655',
            ],
            [
                'cuisine_id' => 2, // Gudeg
                'name' => 'Gudeg Pawon',
                'address' => 'Jl. Janturan, Umbulharjo, Yogyakarta',
                'latitude' => -7.8156,
                'longitude' => 110.3895,
                'opening_hours' => '17:00-01:00',
                'price_range' => '20000-40000',
                'contact' => '0274-451234',
            ],
            
            // Pempek vendors
            [
                'cuisine_id' => 3, // Pempek
                'name' => 'Pempek Ny. Kamto',
                'address' => 'Jl. Veteran No. 188A, Palembang',
                'latitude' => -2.9760,
                'longitude' => 104.7458,
                'opening_hours' => '08:00-20:00',
                'price_range' => '25000-50000',
                'contact' => '0711-351234',
            ],
            
            // Soto Lamongan vendors
            [
                'cuisine_id' => 4, // Soto Lamongan
                'name' => 'Soto Lamongan Cak Har',
                'address' => 'Jl. Veteran No. 16, Surabaya',
                'latitude' => -7.2575,
                'longitude' => 112.7521,
                'opening_hours' => '08:00-15:00',
                'price_range' => '15000-25000',
                'contact' => '031-5345678',
            ],
            
            // Kerak Telor vendors
            [
                'cuisine_id' => 5, // Kerak Telor
                'name' => 'Kerak Telor H. Mamat',
                'address' => 'Monas, Jakarta Pusat',
                'latitude' => -6.1754,
                'longitude' => 106.8272,
                'opening_hours' => '09:00-21:00',
                'price_range' => '15000-25000',
                'contact' => '081234567890',
            ],
            
            // Klepon vendors
            [
                'cuisine_id' => 6, // Klepon
                'name' => 'Toko Kue Tradisional Mbah Wati',
                'address' => 'Jl. Malioboro No. 145, Yogyakarta',
                'latitude' => -7.7926,
                'longitude' => 110.3656,
                'opening_hours' => '07:00-19:00',
                'price_range' => '5000-15000',
                'contact' => '0274-562345',
            ],
            
            // Es Cendol vendors
            [
                'cuisine_id' => 7, // Es Cendol
                'name' => 'Es Cendol Elizabeth',
                'address' => 'Jl. Braga No. 58, Bandung',
                'latitude' => -6.9175,
                'longitude' => 107.6191,
                'opening_hours' => '10:00-22:00',
                'price_range' => '8000-15000',
                'contact' => '022-4234567',
            ],
            
            // Ayam Betutu vendors
            [
                'cuisine_id' => 8, // Ayam Betutu
                'name' => 'Warung Men Tempeh',
                'address' => 'Jl. Monkey Forest Rd, Ubud, Bali',
                'latitude' => -8.5089,
                'longitude' => 115.2624,
                'opening_hours' => '11:00-22:00',
                'price_range' => '75000-150000',
                'contact' => '0361-978345',
            ],
        ];

        foreach ($vendors as $vendor) {
            Vendor::create($vendor);
        }
    }
}
