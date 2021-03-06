"""empty message

Revision ID: 01356afcc714
Revises: 356add9f6b39
Create Date: 2017-09-25 18:36:08.427994

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '01356afcc714'
down_revision = '356add9f6b39'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('firebase_name', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'firebase_name')
    # ### end Alembic commands ###
