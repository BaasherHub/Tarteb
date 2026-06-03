import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/employer/models/browse_filters.dart';

abstract final class CandidateBrowseRepository {
  static const int pageSize = 20;

  static PostgrestFilterBuilder<List<Map<String, dynamic>>> _baseQuery(
    BrowseFilters filters,
  ) {
    var query = TartebSupabase.client.from('candidate_browse').select();

    // Free-text search using OR on multiple columns
    final search = filters.searchQuery.trim();
    if (search.isNotEmpty) {
      // Use ilike for case-insensitive partial matching across multiple fields
      // This searches name, role, and previous_employer
      query = query.or(
        'name.ilike.%$search%,'
        'role.ilike.%$search%,'
        'previous_employer.ilike.%$search%',
      );
    }

    if (filters.roles.isNotEmpty) {
      query = query.inFilter('role', filters.roles.toList());
    }
    if (filters.visaStatuses.isNotEmpty) {
      query = query.inFilter('visa_status', filters.visaStatuses.toList());
    }
    if (filters.locations.isNotEmpty) {
      query = query.inFilter('location', filters.locations.toList());
    }
    if (filters.salaryMin > 0) {
      query = query.gte('salary_expectation', filters.salaryMin.round());
    }
    if (filters.salaryMax < 10000) {
      query = query.lte('salary_expectation', filters.salaryMax.round());
    }
    if (filters.availableNow) {
      final today = DateTime.now();
      final todayStr =
          '${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}';
      query = query.lte('available_from', todayStr);
    }
    final nationality = filters.nationalitySearch.trim();
    if (nationality.isNotEmpty) {
      query = query.ilike('nationality', '%$nationality%');
    }

    return query;
  }

  static Future<List<Map<String, dynamic>>> fetchPage({
    required BrowseFilters filters,
    required int page,
  }) async {
    final from = page * pageSize;
    final to = from + pageSize - 1;

    final data = await _baseQuery(filters)
        .order('created_at', ascending: false)
        .range(from, to);

    return List<Map<String, dynamic>>.from(data);
  }
}
