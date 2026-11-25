from django.contrib import admin

from doctors.models import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'specialization', 'email', 'phone', 'years_of_experience', 'created_at')
    list_filter = ('specialization',)
    search_fields = ('name', 'specialization', 'email')
