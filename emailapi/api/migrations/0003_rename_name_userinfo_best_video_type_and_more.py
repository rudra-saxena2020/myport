# Generated by Django 5.1.6 on 2025-06-05 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_userinfo_created_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userinfo',
            old_name='name',
            new_name='best_video_type',
        ),
        migrations.AddField(
            model_name='userinfo',
            name='expected_price',
            field=models.CharField(default=0, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='experience_level',
            field=models.CharField(default='beginner', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='full_name',
            field=models.CharField(default='Unknown', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='location',
            field=models.CharField(default='Unknown', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='portfolio_link',
            field=models.URLField(default='http://example.com'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='reason_to_join',
            field=models.TextField(default='No reason provided yet.'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='software_tools_used',
            field=models.CharField(default='Premiere Pro', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='weekly_availability',
            field=models.CharField(default='Full-time', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='whatsapp_number',
            field=models.CharField(default='0000000000', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userinfo',
            name='years_of_experience',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]
