/// Filters applied to the [candidate_browse] query.
class BrowseFilters {
  const BrowseFilters({
    this.roles = const {},
    this.visaStatuses = const {},
    this.locations = const {},
    this.salaryMin = 0,
    this.salaryMax = 10000,
    this.availableNow = false,
    this.nationalitySearch = '',
  });

  final Set<String> roles;
  final Set<String> visaStatuses;
  final Set<String> locations;
  final double salaryMin;
  final double salaryMax;
  final bool availableNow;
  final String nationalitySearch;

  static const BrowseFilters empty = BrowseFilters();

  bool get hasActiveFilters =>
      roles.isNotEmpty ||
      visaStatuses.isNotEmpty ||
      locations.isNotEmpty ||
      salaryMin > 0 ||
      salaryMax < 10000 ||
      availableNow ||
      nationalitySearch.trim().isNotEmpty;

  BrowseFilters copyWith({
    Set<String>? roles,
    Set<String>? visaStatuses,
    Set<String>? locations,
    double? salaryMin,
    double? salaryMax,
    bool? availableNow,
    String? nationalitySearch,
  }) {
    return BrowseFilters(
      roles: roles ?? this.roles,
      visaStatuses: visaStatuses ?? this.visaStatuses,
      locations: locations ?? this.locations,
      salaryMin: salaryMin ?? this.salaryMin,
      salaryMax: salaryMax ?? this.salaryMax,
      availableNow: availableNow ?? this.availableNow,
      nationalitySearch: nationalitySearch ?? this.nationalitySearch,
    );
  }
}
