"""empty message

Revision ID: 09893098abbe
Revises: 644fed244721
Create Date: 2017-07-02 22:01:18.605140

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '09893098abbe'
down_revision = '644fed244721'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(op.f('ix_dataset_avg_read_length_maxrun'), 'dataset', ['avg_read_length_maxrun'], unique=False)
    op.create_index(op.f('ix_dataset_db_source_uid'), 'dataset', ['db_source_uid'], unique=True)
    op.create_index(op.f('ix_dataset_download_size_maxrun'), 'dataset', ['download_size_maxrun'], unique=False)
    op.create_index(op.f('ix_dataset_env_biome'), 'dataset', ['env_biome'], unique=False)
    op.create_index(op.f('ix_dataset_env_feature'), 'dataset', ['env_feature'], unique=False)
    op.create_index(op.f('ix_dataset_env_material'), 'dataset', ['env_material'], unique=False)
    op.create_index(op.f('ix_dataset_env_package'), 'dataset', ['env_package'], unique=False)
    op.create_index(op.f('ix_dataset_gc_percent_maxrun'), 'dataset', ['gc_percent_maxrun'], unique=False)
    op.create_index(op.f('ix_dataset_geo_loc_name'), 'dataset', ['geo_loc_name'], unique=False)
    op.create_index(op.f('ix_dataset_instrument_model'), 'dataset', ['instrument_model'], unique=False)
    op.create_index(op.f('ix_dataset_investigation_type'), 'dataset', ['investigation_type'], unique=False)
    op.create_index(op.f('ix_dataset_library_construction_method'), 'dataset', ['library_construction_method'], unique=False)
    op.create_index(op.f('ix_dataset_library_reads_sequenced_maxrun'), 'dataset', ['library_reads_sequenced_maxrun'], unique=False)
    op.create_index(op.f('ix_dataset_library_screening_strategy'), 'dataset', ['library_screening_strategy'], unique=False)
    op.create_index(op.f('ix_dataset_library_source'), 'dataset', ['library_source'], unique=False)
    op.create_index(op.f('ix_dataset_library_strategy'), 'dataset', ['library_strategy'], unique=False)
    op.create_index(op.f('ix_dataset_meta_latitude'), 'dataset', ['meta_latitude'], unique=False)
    op.create_index(op.f('ix_dataset_meta_longitude'), 'dataset', ['meta_longitude'], unique=False)
    op.create_index(op.f('ix_dataset_sequencing_method'), 'dataset', ['sequencing_method'], unique=False)
    op.create_index(op.f('ix_dataset_study_type'), 'dataset', ['study_type'], unique=False)
    op.create_index(op.f('ix_dataset_total_num_bases_maxrun'), 'dataset', ['total_num_bases_maxrun'], unique=False)
    op.create_index(op.f('ix_publication_pubmed_uid'), 'publication', ['pubmed_uid'], unique=True)
    op.create_index(op.f('ix_run_run_id'), 'run', ['run_id'], unique=True)
    op.create_index(op.f('ix_scrape_error_uid'), 'scrape_error', ['uid'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_scrape_error_uid'), table_name='scrape_error')
    op.drop_index(op.f('ix_run_run_id'), table_name='run')
    op.drop_index(op.f('ix_publication_pubmed_uid'), table_name='publication')
    op.drop_index(op.f('ix_dataset_total_num_bases_maxrun'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_study_type'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_sequencing_method'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_meta_longitude'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_meta_latitude'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_library_strategy'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_library_source'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_library_screening_strategy'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_library_reads_sequenced_maxrun'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_library_construction_method'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_investigation_type'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_instrument_model'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_geo_loc_name'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_gc_percent_maxrun'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_env_package'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_env_material'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_env_feature'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_env_biome'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_download_size_maxrun'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_db_source_uid'), table_name='dataset')
    op.drop_index(op.f('ix_dataset_avg_read_length_maxrun'), table_name='dataset')
    # ### end Alembic commands ###
