from django.contrib import admin
from django.http import HttpResponse
import openpyxl
from .models import UserInfo

# Excel export action
@admin.action(description='Export Selected to Excel')
def export_to_excel(modeladmin, request, queryset):
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = "User Info"

    # Header row
    headers = ['ID', 'Name', 'Email', 'Created At']
    sheet.append(headers)

    # Data rows
    for user in queryset:
        sheet.append([
            user.id,
            user.full_name,  # updated field name from `name` to `full_name`
            user.email,
            user.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="user_info.xlsx"'
    workbook.save(response)
    return response

# Admin config
@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'created_at')  # use `full_name`
    list_filter = ('created_at',)
    search_fields = ('full_name', 'email')  # use `full_name`
    ordering = ('-id',)
    actions = [export_to_excel]
