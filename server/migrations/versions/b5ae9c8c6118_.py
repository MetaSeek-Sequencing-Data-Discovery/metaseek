"""empty message

Revision ID: b5ae9c8c6118
Revises: aa1ce7a80455
Create Date: 2017-06-28 11:39:37.100530

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b5ae9c8c6118'
down_revision = 'aa1ce7a80455'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'publication', ['pubmed_uid'])
    op.create_unique_constraint(None, 'run', ['run_id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'run', type_='unique')
    op.drop_constraint(None, 'publication', type_='unique')
    # ### end Alembic commands ###