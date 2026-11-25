from django.contrib import admin

from mappings.models import PatientDoctorMapping


@admin.register(PatientDoctorMapping)
class PatientDoctorMappingAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'assigned_by', 'assigned_at')
    list_filter = ('assigned_at',)
    search_fields = ('patient__name', 'doctor__name')
