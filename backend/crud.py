import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import Integer, String, Text, DateTime
from datetime import datetime
from sqlalchemy.future import select

DATABASE_URL = "sqlite+aiosqlite:///./opd_database.db"
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

Base = declarative_base()

class OPDDocumentItem(Base):
    __tablename__ = "opd_documents"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    patient_name: Mapped[str] = mapped_column(String(100), nullable=True, default="Unknown Patient")
    age: Mapped[str] = mapped_column(String(20), nullable=True, default="Unknown")
    gender: Mapped[str] = mapped_column(String(20), nullable=True, default="Unknown")
    date: Mapped[str] = mapped_column(String(50), nullable=True)
    chief_complaint: Mapped[str] = mapped_column(Text, nullable=True)
    history: Mapped[str] = mapped_column(Text, nullable=True)
    examination: Mapped[str] = mapped_column(Text, nullable=True)
    diagnosis: Mapped[str] = mapped_column(Text, nullable=True)
    prescription: Mapped[str] = mapped_column(Text, nullable=True)
    advice: Mapped[str] = mapped_column(Text, nullable=True)
    follow_up: Mapped[str] = mapped_column(String(100), nullable=True)
    raw_transcript: Mapped[str] = mapped_column(Text, nullable=True)
    language_detected: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def create_document(session: AsyncSession, doc_data: dict):
    # Filter keys that are not in the database model
    from sqlalchemy import inspect
    mapper = inspect(OPDDocumentItem)
    allowed_keys = {c.key for c in mapper.attrs}
    filtered_data = {k: v for k, v in doc_data.items() if k in allowed_keys and k != 'id'}
    
    db_item = OPDDocumentItem(**filtered_data)
    session.add(db_item)
    await session.commit()
    await session.refresh(db_item)
    return db_item

async def list_documents(session: AsyncSession):
    result = await session.execute(select(OPDDocumentItem).order_by(OPDDocumentItem.created_at.desc()))
    return result.scalars().all()

async def get_document(session: AsyncSession, doc_id: int):
    result = await session.execute(select(OPDDocumentItem).where(OPDDocumentItem.id == doc_id))
    return result.scalar_one_or_none()

async def update_document(session: AsyncSession, doc_id: int, doc_data: dict):
    from sqlalchemy import inspect
    db_item = await get_document(session, doc_id)
    if not db_item:
        return None
        
    mapper = inspect(OPDDocumentItem)
    allowed_keys = {c.key for c in mapper.attrs}
    
    for key, value in doc_data.items():
        if key in allowed_keys and key != 'id':
            setattr(db_item, key, value)
            
    await session.commit()
    await session.refresh(db_item)
    return db_item
