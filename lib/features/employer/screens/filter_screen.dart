import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/employer/models/browse_filters.dart';

/// Filter UI shown as a modal bottom sheet from [BrowseScreen].
class FilterBottomSheet extends StatefulWidget {
  const FilterBottomSheet({super.key, required this.initialFilters});

  final BrowseFilters initialFilters;

  static Future<BrowseFilters?> show(
    BuildContext context, {
    required BrowseFilters initialFilters,
  }) {
    return showModalBottomSheet<BrowseFilters>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.viewInsetsOf(ctx).bottom,
        ),
        child: SizedBox(
          height: MediaQuery.of(ctx).size.height * 0.88,
          child: FilterBottomSheet(initialFilters: initialFilters),
        ),
      ),
    );
  }

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late Set<String> _roles;
  late Set<String> _visaStatuses;
  late Set<String> _locations;
  late double _salaryMin;
  late double _salaryMax;
  late bool _availableNow;
  late TextEditingController _nationalityController;

  @override
  void initState() {
    super.initState();
    _roles = Set.from(widget.initialFilters.roles);
    _visaStatuses = Set.from(widget.initialFilters.visaStatuses);
    _locations = Set.from(widget.initialFilters.locations);
    _salaryMin = widget.initialFilters.salaryMin;
    _salaryMax = widget.initialFilters.salaryMax;
    _availableNow = widget.initialFilters.availableNow;
    _nationalityController = TextEditingController(
      text: widget.initialFilters.nationalitySearch,
    );
  }

  @override
  void dispose() {
    _nationalityController.dispose();
    super.dispose();
  }

  void _toggle(Set<String> set, String value) {
    setState(() {
      if (set.contains(value)) {
        set.remove(value);
      } else {
        set.add(value);
      }
    });
  }

  BrowseFilters _buildFilters() {
    return BrowseFilters(
      roles: _roles,
      visaStatuses: _visaStatuses,
      locations: _locations,
      salaryMin: _salaryMin,
      salaryMax: _salaryMax,
      availableNow: _availableNow,
      nationalitySearch: _nationalityController.text.trim(),
    );
  }

  void _reset() {
    Navigator.of(context).pop(BrowseFilters.empty);
  }

  void _apply() {
    Navigator.of(context).pop(_buildFilters());
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 8, 0),
          child: Row(
            children: [
              Text(
                'Filters',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const Spacer(),
              TextButton(onPressed: _reset, child: const Text('Reset')),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _sectionTitle('Role'),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: AppStrings.candidateRoles.map((role) {
                  final selected = _roles.contains(role);
                  return FilterChip(
                    label: Text(role),
                    selected: selected,
                    onSelected: (_) => _toggle(_roles, role),
                    selectedColor: AppColors.primary.withValues(alpha: 0.2),
                    checkmarkColor: AppColors.primary,
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              _sectionTitle('Visa status'),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: AppStrings.visaStatuses.map((visa) {
                  final selected = _visaStatuses.contains(visa);
                  return FilterChip(
                    label: Text(visa),
                    selected: selected,
                    onSelected: (_) => _toggle(_visaStatuses, visa),
                    selectedColor: AppColors.primary.withValues(alpha: 0.2),
                    checkmarkColor: AppColors.primary,
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              _sectionTitle('Location'),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: AppStrings.locations.map((loc) {
                  final selected = _locations.contains(loc);
                  return FilterChip(
                    label: Text(loc),
                    selected: selected,
                    onSelected: (_) => _toggle(_locations, loc),
                    selectedColor: AppColors.primary.withValues(alpha: 0.2),
                    checkmarkColor: AppColors.primary,
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              _sectionTitle('Salary range (AED/month)'),
              RangeSlider(
                values: RangeValues(_salaryMin, _salaryMax),
                min: 0,
                max: 10000,
                divisions: 100,
                labels: RangeLabels(
                  '${_salaryMin.round()}',
                  '${_salaryMax.round()}',
                ),
                onChanged: (v) => setState(() {
                  _salaryMin = v.start;
                  _salaryMax = v.end;
                }),
              ),
              Text(
                'AED ${_salaryMin.round()} – ${_salaryMax.round()}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 20),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Available now'),
                subtitle: const Text('Available from today or earlier'),
                value: _availableNow,
                onChanged: (v) => setState(() => _availableNow = v),
              ),
              const SizedBox(height: 12),
              _sectionTitle('Nationality'),
              TextField(
                controller: _nationalityController,
                decoration: const InputDecoration(
                  hintText: 'Search nationality...',
                  prefixIcon: Icon(Icons.search),
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: FilledButton(
              onPressed: _apply,
              child: const Text('Apply'),
            ),
          ),
        ),
      ],
    );
  }

  Widget _sectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(fontWeight: FontWeight.w600),
      ),
    );
  }
}
