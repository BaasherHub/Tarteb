import 'package:tarteb/core/supabase/supabase_client.dart';

/// Service to manage employer favorites (shortlist) for candidates.
/// Favorites allow employers to save candidates without unlocking them.
class FavoritesService {
  FavoritesService._();
  
  /// Singleton instance for easy access across the app.
  static final FavoritesService instance = FavoritesService._();

  /// Cache of favorited candidate IDs for quick lookup.
  final Set<String> _favoriteIds = {};
  bool _initialized = false;

  /// Get the current user's employer ID.
  String? get _employerId => TartebSupabase.auth.currentUser?.id;

  /// Returns true if the candidate is favorited.
  bool isFavorite(String candidateId) => _favoriteIds.contains(candidateId);

  /// Returns the set of all favorited candidate IDs.
  Set<String> get favoriteIds => Set.unmodifiable(_favoriteIds);

  /// Load favorites from the database. Call this on app init or login.
  Future<void> load() async {
    final employerId = _employerId;
    if (employerId == null) return;

    try {
      final data = await TartebSupabase.client
          .from('employer_favorites')
          .select('candidate_id')
          .eq('employer_id', employerId);

      _favoriteIds.clear();
      for (final row in data) {
        final id = row['candidate_id'];
        if (id != null) _favoriteIds.add(id.toString());
      }
      _initialized = true;
    } catch (e) {
      // Silent fail - favorites are a nice-to-have feature
      _favoriteIds.clear();
    }
  }

  /// Ensure favorites are loaded (call before checking favorites).
  Future<void> ensureLoaded() async {
    if (!_initialized) await load();
  }

  /// Toggle favorite status for a candidate.
  /// Returns the new favorite status.
  Future<bool> toggle(String candidateId) async {
    final employerId = _employerId;
    if (employerId == null) return false;

    final wasFavorite = _favoriteIds.contains(candidateId);

    if (wasFavorite) {
      // Remove from favorites
      _favoriteIds.remove(candidateId);
      await TartebSupabase.client
          .from('employer_favorites')
          .delete()
          .eq('employer_id', employerId)
          .eq('candidate_id', candidateId);
      return false;
    } else {
      // Add to favorites
      _favoriteIds.add(candidateId);
      await TartebSupabase.client.from('employer_favorites').insert({
        'employer_id': employerId,
        'candidate_id': candidateId,
      });
      return true;
    }
  }

  /// Add a candidate to favorites.
  Future<void> add(String candidateId) async {
    if (_favoriteIds.contains(candidateId)) return;
    await toggle(candidateId);
  }

  /// Remove a candidate from favorites.
  Future<void> remove(String candidateId) async {
    if (!_favoriteIds.contains(candidateId)) return;
    await toggle(candidateId);
  }

  /// Fetch all favorited candidates with their details.
  Future<List<Map<String, dynamic>>> fetchFavorites() async {
    final employerId = _employerId;
    if (employerId == null) return [];

    try {
      final data = await TartebSupabase.client
          .from('employer_favorites')
          .select('''
            id,
            created_at,
            candidates(
              id,
              name,
              role,
              visa_status,
              location,
              salary_expectation,
              photo_url,
              years_experience,
              has_uae_experience,
              available_from,
              confidence_score
            )
          ''')
          .eq('employer_id', employerId)
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      return [];
    }
  }

  /// Clear all favorites (useful on logout).
  void clear() {
    _favoriteIds.clear();
    _initialized = false;
  }
}
