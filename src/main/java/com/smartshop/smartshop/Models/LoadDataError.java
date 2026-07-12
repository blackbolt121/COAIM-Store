package com.smartshop.smartshop.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "load_errors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoadDataError {

    @Id
    @Column(length = 36, nullable = false, updatable = false)
    private String id;

    @Column(length = 80, nullable = false)
    private String source;

    @Column(length = 50)
    private String codigo;

    @Column(name = "codigo_barras", length = 80)
    private String codigoBarras;

    @Column(length = 1000, nullable = false)
    private String message;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String details;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
