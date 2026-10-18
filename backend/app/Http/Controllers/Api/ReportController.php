<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    private const SORTABLE = [
        'domainName' => 'domain_name', 'ministry' => 'ministry', 'state' => 'state',
        'department' => 'department', 'organisation' => 'organisation',
        'orgCategory' => 'org_category', 'nodalOfficer' => 'nodal_officer',
        'email' => 'email', 'status' => 'status', 'activationDate' => 'activation_date',
        'createdDate' => 'created_date', 'lastUpdated' => 'last_updated',
    ];

    public function index(Request $request)
    {
        $filters = $request->validate([
            'ministry' => ['sometimes', 'nullable', 'string', 'max:160'],
            'state' => ['sometimes', 'nullable', 'string', 'max:100'],
            'department' => ['sometimes', 'nullable', 'string', 'max:180'],
            'organisation' => ['sometimes', 'nullable', 'string', 'max:180'],
            'orgCategory' => ['sometimes', 'nullable', 'string', 'max:80'],
            'status' => ['sometimes', 'nullable', 'in:Active,Pending,Rejected,Cancelled,Transferred'],
            'dateFrom' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'dateTo' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'after_or_equal:dateFrom'],
            'dateExact' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'q' => ['sometimes', 'nullable', 'string', 'max:120'],
            'sort' => ['sometimes', 'nullable', 'in:domainName,ministry,state,department,organisation,orgCategory,nodalOfficer,email,status,activationDate,createdDate,lastUpdated'],
            'direction' => ['sometimes', 'nullable', 'in:asc,desc'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $query = $this->filteredQuery($filters);
        $statusCounts = (clone $query)
            ->select('status', DB::raw('COUNT(*) as value'))
            ->groupBy('status')->pluck('value', 'status');
        $filteredTotal = (clone $query)->count();
        $sort = $filters['sort'] ?? 'domainName';
        $query->orderBy(self::SORTABLE[$sort], $filters['direction'] ?? 'asc');

        $results = $query->paginate($filters['per_page'] ?? 25)->withQueryString();
        return response()->json([
            'data' => collect($results->items())->map(fn (Domain $domain) => $this->serialize($domain)),
            'meta' => [
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total(),
            ],
            'stats' => [
                'total' => $filteredTotal,
                'active' => (int) ($statusCounts['Active'] ?? 0),
                'pending' => (int) ($statusCounts['Pending'] ?? 0),
                'rejected' => (int) ($statusCounts['Rejected'] ?? 0),
                'cancelled' => (int) ($statusCounts['Cancelled'] ?? 0),
                'transferred' => (int) ($statusCounts['Transferred'] ?? 0),
            ],
        ]);
    }

    public function search(Request $request)
    {
        return $this->index($request);
    }

    public function nodalOfficer(Request $request)
    {
        return $this->index($request);
    }

    public function summary()
    {
        $statuses = Domain::query()->select('status', DB::raw('COUNT(*) as value'))->groupBy('status')->pluck('value', 'status');
        $breakdown = fn (string $column) => Domain::query()
            ->select($column, DB::raw('COUNT(*) as value'))
            ->groupBy($column)->orderByDesc('value')->get()
            ->map(fn ($row) => ['name' => $row->{$column}, 'value' => (int) $row->value]);
        $format = DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', activation_date)"
            : "DATE_FORMAT(activation_date, '%Y-%m')";
        $monthly = Domain::query()->whereNotNull('activation_date')
            ->selectRaw("{$format} as month_key, COUNT(*) as value")
            ->groupBy('month_key')->orderBy('month_key')->get()
            ->map(fn ($row) => ['month' => date('M y', strtotime($row->month_key.'-01')), 'value' => (int) $row->value]);

        return response()->json([
            'stats' => [
                'total' => (int) Domain::count(),
                'active' => (int) ($statuses['Active'] ?? 0),
                'pending' => (int) ($statuses['Pending'] ?? 0),
                'rejected' => (int) ($statuses['Rejected'] ?? 0),
                'cancelled' => (int) ($statuses['Cancelled'] ?? 0),
                'transferred' => (int) ($statuses['Transferred'] ?? 0),
            ],
            'byStatus' => $statuses->map(fn ($value, $name) => ['name' => $name, 'value' => (int) $value])->values(),
            'byMinistry' => $breakdown('ministry'),
            'byState' => $breakdown('state'),
            'byCategory' => $breakdown('org_category'),
            'monthlyActivations' => $monthly,
        ]);
    }

    public function options()
    {
        return response()->json([
            'ministry' => Domain::query()->whereNotNull('ministry')->distinct()->orderBy('ministry')->pluck('ministry'),
            'state' => Domain::query()->whereNotNull('state')->distinct()->orderBy('state')->pluck('state'),
            'department' => Domain::query()->whereNotNull('department')->distinct()->orderBy('department')->pluck('department'),
            'organisation' => Domain::query()->whereNotNull('organisation')->distinct()->orderBy('organisation')->pluck('organisation'),
            'orgCategory' => Domain::query()->whereNotNull('org_category')->distinct()->orderBy('org_category')->pluck('org_category'),
            'status' => ['Active', 'Pending', 'Rejected', 'Cancelled', 'Transferred'],
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $filters = $request->validate([
            'ministry' => ['sometimes', 'nullable', 'string', 'max:160'],
            'state' => ['sometimes', 'nullable', 'string', 'max:100'],
            'department' => ['sometimes', 'nullable', 'string', 'max:180'],
            'organisation' => ['sometimes', 'nullable', 'string', 'max:180'],
            'orgCategory' => ['sometimes', 'nullable', 'string', 'max:80'],
            'status' => ['sometimes', 'nullable', 'in:Active,Pending,Rejected,Cancelled,Transferred'],
            'dateFrom' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'dateTo' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'after_or_equal:dateFrom'],
            'dateExact' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'q' => ['sometimes', 'nullable', 'string', 'max:120'],
        ]);
        $query = $this->filteredQuery($filters)->orderBy('domain_name');
        $headers = ['Domain Name', 'Ministry', 'State / UT', 'Department', 'Organisation', 'Organisation Category', 'Nodal Officer', 'Email', 'Status', 'Activation Date', 'Created Date', 'Last Updated'];
        $fields = ['domain_name', 'ministry', 'state', 'department', 'organisation', 'org_category', 'nodal_officer', 'email', 'status', 'activation_date', 'created_date', 'last_updated'];

        return response()->streamDownload(function () use ($query, $headers, $fields) {
            $output = fopen('php://output', 'w');
            fputcsv($output, $headers);
            $query->chunk(500, function ($domains) use ($output, $fields) {
                foreach ($domains as $domain) {
                    $dateFields = ['activation_date', 'created_date', 'last_updated'];
                    fputcsv($output, array_map(function ($field) use ($domain, $dateFields) {
                        return in_array($field, $dateFields, true) ? $domain->{$field}?->format('Y-m-d') : $domain->{$field};
                    }, $fields));
                }
            });
            fclose($output);
        }, 'domain-report.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function filteredQuery(array $filters): Builder
    {
        $query = Domain::query();
        foreach ([
            'ministry' => 'ministry', 'state' => 'state', 'department' => 'department',
            'organisation' => 'organisation', 'orgCategory' => 'org_category', 'status' => 'status',
        ] as $input => $column) {
            if (!empty($filters[$input])) $query->where($column, $filters[$input]);
        }
        if (!empty($filters['dateExact'])) $query->whereDate('activation_date', $filters['dateExact']);
        if (!empty($filters['dateFrom'])) $query->whereDate('activation_date', '>=', $filters['dateFrom']);
        if (!empty($filters['dateTo'])) $query->whereDate('activation_date', '<=', $filters['dateTo']);
        if (!empty($filters['q'])) {
            $term = $filters['q'];
            $query->where(function (Builder $query) use ($term) {
                foreach (['domain_name', 'ministry', 'state', 'department', 'organisation', 'org_category', 'nodal_officer', 'email', 'status'] as $column) {
                    $query->orWhere($column, 'like', "%{$term}%");
                }
            });
        }
        return $query;
    }

    private function serialize(Domain $domain): array
    {
        return [
            'id' => $domain->id,
            'domainName' => $domain->domain_name,
            'ministry' => $domain->ministry,
            'state' => $domain->state,
            'department' => $domain->department,
            'organisation' => $domain->organisation,
            'orgCategory' => $domain->org_category,
            'nodalOfficer' => $domain->nodal_officer,
            'email' => $domain->email,
            'status' => $domain->status,
            'activationDate' => $domain->activation_date?->format('Y-m-d'),
            'createdDate' => $domain->created_date?->format('Y-m-d'),
            'lastUpdated' => $domain->last_updated?->format('Y-m-d'),
        ];
    }
}
