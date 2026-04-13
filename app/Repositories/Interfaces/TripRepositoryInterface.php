<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface TripRepositoryInterface
{
    public function all(array $filters = []): LengthAwarePaginator;
    public function find(int $id): ?Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): Model;
    public function addStudentsToTrip(int $tripId, array $studentIds): void;
    public function completeTrip(int $tripId): Model;
    public function getTodaysTrips(int $teacherId): Collection;
    public function getUpcomingTrips(int $teacherId): Collection;
    public function generateTripNumber(): string;
}
