<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personnel;
use App\Models\Training;
use App\Models\Leave;
use App\Models\Attendance;
// use App\Models\Document;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $alerts = [];

        // -------------------------------
        // 1️⃣ Document Expiring (next 30 days)
        // if (class_exists(Document::class)) {
        //     $documentsExpiring = Document::whereNotNull('expiry_date')
        //         ->whereDate('expiry_date', '<=', $now->copy()->addDays(30))
        //         ->with('personnel')
        //         ->get();

        //     foreach ($documentsExpiring as $doc) {
        //         $alerts[] = [
        //             'personnel_id' => $doc->personnel_id,
        //             'alert_type' => 'Document',
        //             'description' => $doc->document_type . ' expiring on ' . Carbon::parse($doc->expiry_date)->format('Y-m-d'),
        //             'alert_date' => $now->format('Y-m-d'),
        //             'resolved' => false,
        //             'personnel_name' => $doc->personnel->full_name_en ?? null
        //         ];
        //     }
        // }

        // -------------------------------
        // 2️⃣ Training Expiring (next 30 days)
        $trainingsExpiring = Training::whereDate('end_date', '<=', $now->copy()->addDays(30))
            ->with('personnel')
            ->get();

        foreach ($trainingsExpiring as $t) {
            $alerts[] = [
                'personnel_id' => $t->personnel_id,
                'alert_type' => 'Training',
                'description' => $t->course_name . ' ends on ' . Carbon::parse($t->end_date)->format('Y-m-d'),
                'alert_date' => $now->format('Y-m-d'),
                'resolved' => false,
                'personnel_name' => $t->personnel->full_name_en ?? null
            ];
        }

        // -------------------------------
        // 3️⃣ Leave Near Zero
        $leavesLow = Leave::where('leave_balance', '<=', 1)
            ->with('personnel')
            ->get();

        foreach ($leavesLow as $lb) {
            $alerts[] = [
                'personnel_id' => $lb->personnel_id,
                'alert_type' => 'Leave',
                'description' => 'Leave balance is low: ' . $lb->leave_balance,
                'alert_date' => $now->format('Y-m-d'),
                'resolved' => false,
                'personnel_name' => $lb->personnel->full_name_en ?? null
            ];
        }

        // -------------------------------
        // 4️⃣ Absences Too Many (>=5)
        $absences = Attendance::select('personnel_id')
            ->where('status', 'Absent')
            ->groupBy('personnel_id')
            ->havingRaw('COUNT(*) >= 5')
            ->with('personnel')
            ->get();

        foreach ($absences as $a) {
            $alerts[] = [
                'personnel_id' => $a->personnel_id,
                'alert_type' => 'Attendance',
                'description' => 'Too many absences (>=5)',
                'alert_date' => $now->format('Y-m-d'),
                'resolved' => false,
                'personnel_name' => $a->personnel->full_name_en ?? null
            ];
        }

        // -------------------------------
        // Return JSON for React Dashboard
        return response()->json($alerts);
    }
}
